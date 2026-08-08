from collections import Counter
from PIL import Image

paths = [
    r"C:\Users\RENTEC~1\AppData\Local\Temp\codex-clipboard-3bb251f2-414e-4221-a98a-57831241405b.png",
    r"C:\Users\RENTEC~1\AppData\Local\Temp\codex-clipboard-26aca9a5-7112-4e95-821f-0425c3d2aadb.png",
]

for path in paths:
    image = Image.open(path).convert("RGB")
    print("IMAGE", image.size)
    print("COLORS", Counter(image.getdata()).most_common(10))
    for y in (240, 243, 265, 286, 305, 326, 347, 400, 650, 698, 718):
        if y >= image.height:
            continue
        row = [image.getpixel((x, y)) for x in range(image.width)]
        runs = []
        start = 0
        for x in range(1, image.width + 1):
            if x == image.width or row[x] != row[start]:
                if x - start >= 10:
                    runs.append((start, x - 1, row[start]))
                start = x
        print("ROW", y, runs[:14])
    print()
