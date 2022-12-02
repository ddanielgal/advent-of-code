import LineByLine from "n-readlines";
import * as fs from "fs";

export default function forEachLine(
  file: fs.PathLike,
  callback: (line: string) => void
) {
  const input = new LineByLine(file);
  for (let line = input.next(); line; line = input.next()) {
    callback(line.toString());
  }
}
