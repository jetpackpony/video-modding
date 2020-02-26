import ffmpeg
from env import is_prod
import os.path
from files import create_dir

target_path = "../downloads/" if is_prod() else "../dev_downloads/"
create_dir(target_path)

#ffmpeg -y -i https://v.redd.it/ybcg6qv72oh41/HLSPlaylist.m3u8 -c copy -bsf:a aac_adtstoasc output.mp4
#ffmpeg -y -i https://v.redd.it/cdtxwl2266i41/HLSPlaylist.m3u8 -c copy -bsf:a aac_adtstoasc out.mp4
def download_video(url, name):
  filename = target_path + name + '.mp4'
  if os.path.isfile(filename):
    print("%s already exists, skipping download" % name)
    return True
  else:
    try:
      (
        ffmpeg
          .input(url)
          .output(filename, **{'bsf:a': 'aac_adtstoasc', 'c': 'copy'})
          .run(quiet=True, overwrite_output=True)
      )
      return True
    except ffmpeg.Error as err:
      print("ffmpeg Error: %s" % err.stderr)
      return False

if __name__ == "__main__":
  print(download_video('https://v.redd.it/cdtxwl2266i41/HLSPlaylist.m3u8', 'out'))
  # print(download_video('https://v.redd.it/rlnu4cax6bi41/HLSPlaylist.m3u8', 'out'))