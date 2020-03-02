from pprint import pprint
from moviepy.editor import *
from json_ops import read_json
from editing import *
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
  collection = read_json(collections_path + filename)
  dir_path = outputs_path + collection['id'] + "/"
  create_dir(dir_path)

  clips = list(map(lambda info: process_clip(info, resolution), collection['videos']))
  out = concatenate_videoclips(clips, method="compose", transition=trans)
  out.write_videofile(dir_path + collection['id'] + ".mp4", threads = 4, fps = 30)

  move_file(collections_path + filename, dir_path + filename)
