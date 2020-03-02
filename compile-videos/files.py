from pathlib import Path
import os
import re

def create_file_and_dir(dir, file):
  create_dir(dir)
  (Path(dir) / file).touch()

def create_dir(dir):
  dir = Path(dir)
  if not dir.is_dir():
    dir.mkdir()

jsonReg = re.compile(r".+\.json$")
def list_json_files(dir):
  files = []
  with os.scandir(dir) as entries:
    for entry in entries:
      if jsonReg.search(entry.name):
        files.append(entry.name)
  return files

def move_file(fr, to):
  os.rename(fr, to)

if __name__ == "__main__":
  create_file_and_dir("../../dev", "test.json")
