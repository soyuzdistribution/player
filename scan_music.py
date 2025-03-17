import os
import json

def scan_music_directory():
    # Получаем список всех mp3 файлов
    music_files = [f for f in os.listdir('.') if f.endswith('.mp3')]
    
    # Создаем список треков с их данными
    tracks = []
    for file in music_files:
        track = {
            "filename": file,
            "name": os.path.splitext(file)[0]  # Имя файла без расширения
        }
        tracks.append(track)
    
    # Сохраняем данные в JSON файл
    with open('tracks.json', 'w', encoding='utf-8') as f:
        json.dump({"tracks": tracks}, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    scan_music_directory() 