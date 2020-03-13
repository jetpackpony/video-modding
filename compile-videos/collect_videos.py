from pprint import pprint
from pymongo import MongoClient
from download_video import download_video
from mongo import *
from json_ops import write_json
from env import is_prod
import datetime
from files import create_file_and_dir
from random import randrange

VIDEO_LENGTH = 60 * 10

# Check if output dir exists and create it if not
collections_path = "../../collections/" if is_prod() else "../../dev_collections/"

vid_keys = ["id", "media", "title", "thumbnail", "screenshots"]
def select_keys_from_vid(vid):
  res = {}
  for key in vid_keys:
    if key in vid:
      res[key] = vid[key]
    else:
      res[key] = None
  return res

# Collect unmuted videos to fill
def collect_videos(vids, target_length):
  print("Start collecting videos from DB")
  collection_length = 0
  success_vids = []
  failed_vids = []
  for vid in vids:
    pprint("Starting %s" % vid['id'])
    res = download_video(vid['hls_url'], vid['id'])
    if res:
      success_vids.append(vid)
      collection_length += vid['media']['end'] - vid['media']['start']
    else:
      failed_vids.append(vid['id'])
    if collection_length > target_length:
      out_vids = list(map(select_keys_from_vid, success_vids))
      return out_vids
  
  return None

def make_compilation(form):
  vids_with_audio = get_unused_videos_with_sound()
  vids_muted = get_unused_videos_muted()
  sequences = []
  ids = []

  for (is_muted, has_transitions, music_over, length) in form:
    vids = collect_videos(vids_muted if is_muted else vids_with_audio, length)
    if not vids:
      return None
    sequences.append({
      "transitions": has_transitions,
      "sound_over": music_over,
      "videos": vids
    })
    ids.extend(list(map(lambda vid: vid["id"], vids)))

  return (sequences, ids)

# Every sequence is of form (is_muted: Bool, has_transitions: Bool, music_over: String, length: int)
music1 = { "filename": "../../music/Thug_Dub.mp3", "start": 18 }
music2 = { "filename": "../../music/Thug_Dub.mp3", "start": 91 }
compilation_form = [
  (False, True, None, 1 * 60),
  (True, False, music1, 0.5 * 60),
  (False, True, None, 1 * 60),
  (True, False, music2, 0.5 * 60),
  (False, True, None, 0.5 * 60)
]

while True:
  res = make_compilation(compilation_form)
  if not res:
    print("No more videos, exiting")
    break

  (comp_sequences, ids) = res
  comp_name = datetime.datetime.now().strftime(
      "%d_%b_%Y_%H_%M_%S") + "_" + str(randrange(10000))
  out_filename = comp_name + ".json"
  create_file_and_dir(collections_path, out_filename)
  collection = {
    "id": comp_name,
    "sequences": comp_sequences
  }
  write_json(collections_path + out_filename, collection)
  set_used_videos(ids)
  print("Written collection %s" % comp_name)
