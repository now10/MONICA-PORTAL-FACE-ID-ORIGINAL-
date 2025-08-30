#!/usr/bin/env python3
# compare_faces.py
# Usage: python3 compare_faces.py <enrolled_dir> <login_image>
# Prints: MATCH or NO MATCH or ERROR: <message>

import sys, os
import face_recognition

def main():
    if len(sys.argv) < 3:
        print("ERROR: Missing args")
        sys.exit(1)

    enrolled_dir = sys.argv[1]
    login_img_path = sys.argv[2]

    if not os.path.isdir(enrolled_dir) or not os.path.exists(login_img_path):
        print("ERROR: invalid paths")
        sys.exit(1)

    # load login encodings
    try:
        login_img = face_recognition.load_image_file(login_img_path)
        login_encs = face_recognition.face_encodings(login_img)
        if len(login_encs) == 0:
            print("NO MATCH")
            return
        login_enc = login_encs[0]
    except Exception as e:
        print("ERROR: login image error -", str(e))
        sys.exit(1)

    # iterate enrolled images
    enrolled_files = [f for f in os.listdir(enrolled_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    if not enrolled_files:
        print("NO MATCH")
        return

    for fname in enrolled_files:
        fpath = os.path.join(enrolled_dir, fname)
        try:
            img = face_recognition.load_image_file(fpath)
            encs = face_recognition.face_encodings(img)
            if len(encs) == 0:
                continue
            known_enc = encs[0]
            results = face_recognition.compare_faces([known_enc], login_enc, tolerance=0.5)
            if results[0]:
                print("MATCH")
                return
        except Exception as e:
            # skip problematic file
            continue

    print("NO MATCH")

if __name__ == "__main__":
    main()
