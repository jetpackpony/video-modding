from pprint import pprint
from moviepy.editor import *
from json_ops import read_json
from editing import *

# resolution = (320, 240)
resolution = (1920, 1080)

trans = VideoFileClip("transition_static_0.3sec.mp4")
trans = pad_clip_to_size(resolution, trans)

filename = "../collections/25_Feb_2020_17_34_23.json"
collection = read_json(filename)

clips = list(map(lambda info: process_clip(info, resolution), collection['videos']))
out = concatenate_videoclips(clips, method="compose", transition=trans)

out.write_videofile(collection['id'] + ".mp4", threads = 4, fps = 30)
