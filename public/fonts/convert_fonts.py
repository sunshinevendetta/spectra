import os
from fontTools.ttLib import TTFont

# Correct path: from project root
input_dir = "."
output_dir = input_dir  # Same folder

# Your actual files (case-sensitive!)
font_files = [
    "BINGO-ITALIC.OTF",
    "BINGO.OTF",
    "AGURA.TTF",
    "PRENOPTICA.TTF",
]

def convert_to_woff2(font_path, output_path):
    try:
        font = TTFont(font_path)
        font.flavor = "woff2"
        font.save(output_path)
        print(f"✅ Converted: {os.path.basename(font_path)} → {os.path.basename(output_path)}")
    except Exception as e:
        print(f"❌ Failed {os.path.basename(font_path)}: {e}")

print("Starting font conversion to WOFF2...\n")

for file_name in font_files:
    input_path = os.path.join(input_dir, file_name)
    if not os.path.exists(input_path):
        print(f"⚠️  File not found: {file_name}")
        continue

    base_name = os.path.splitext(file_name)[0]
    output_file = f"{base_name}.woff2"
    output_path = os.path.join(output_dir, output_file)

    convert_to_woff2(input_path, output_path)

print("\n🎉 All done! WOFF2 files are now in public/fonts/")
print("Generated files:")
for file_name in font_files:
    base = os.path.splitext(file_name)[0]
    print(f"   {base}.woff2")