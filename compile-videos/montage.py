from pprint import pprint
from moviepy.editor import *
from json_ops import read_json
from editing import *
from screenshots import *
from env import is_prod
from files import create_dir, list_json_files, move_file

# resolution = (320, 240)
resolution = (1920, 1080)

trans = VideoFileClip("transition_static_0.3sec.mp4")
trans = pad_clip_to_size(resolution, trans)

collections_path = "../../collections/" if is_prod() else "../../dev_collections/"
outputs_path = "../../outputs/" if is_prod() else "../../dev_outputs/"
create_dir(outputs_path)

cols = list_json_files(collections_path)

for filename in cols:
  try:
    collection = read_json(collections_path + filename)
    dir_path = outputs_path + collection['id'] + "/"
    create_dir(dir_path)

    def process_video(info):
      vid_path = videos_path + info['id'] + ".mp4"
      make_screenshots(dir_path, vid_path, info['id'], info["screenshots"])
      return process_clip(info, resolution)

    clips = []
    for seq in collection["sequences"]:
      seq_trans = trans if seq["transitions"] else None
      seq_clips = list(map(process_video, seq['videos']))
      seq_out = concatenate_videoclips(seq_clips, method="compose", transition=seq_trans)
      if seq["sound_over"]:
        audio = AudioFileClip(seq["sound_over"]["filename"])
        audio = audio.subclip(seq["sound_over"]["start"], seq["sound_over"]["start"] + seq_out.duration)
        seq_out = seq_out.set_audio(audio)
      clips.append(seq_out)

    out = concatenate_videoclips(clips, method="compose", transition=trans)
    out.write_videofile(dir_path + collection['id'] + ".mp4", threads = 4, fps = 30)

    move_file(collections_path + filename, dir_path + filename)
  except OSError as err:
    print("!!!!!!!! Couldn't process %s" % filename, err)

