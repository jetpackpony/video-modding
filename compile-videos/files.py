from pathlib import Path


def create_file_and_dir(dir, file):
  create_dir(dir)
  (Path(dir) / file).touch()

def create_dir(dir):
  dir = Path(dir)
  if not dir.is_dir():
    dir.mkdir()


if __name__ == "__main__":
  create_file_and_dir("../../dev", "test.json")
