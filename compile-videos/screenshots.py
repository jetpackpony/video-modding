import os
from moviepy.editor import *

def make_screenshots(out_dir, video_path, id, timestamps):
  if not timestamps:
    return
  clip = VideoFileClip(video_path)
  for t in timestamps:
    imgpath = os.path.join(out_dir, '{}_{}.png'.format(id, t))
    clip.save_frame(imgpath, t)

if __name__ == "__main__":
  # make_screenshots("../../dev_outputs/", "../../dev_downloads/t3_f6w5nq.mp4", "t3_teksjdf", [])
  # make_screenshots("../../dev_outputs/", "../../dev_downloads/t3_f6w5nq.mp4", "t3_teksjdf", None)
  make_screenshots("../../dev_outputs/", "../../dev_downloads/t3_f6w5nq.mp4", "t3_teksjdf", [5.32, 8])
