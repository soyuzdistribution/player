import os
import json

def generate_tracks_json():
    # Путь к папке с музыкой (относительно текущей директории)
    music_dir = "music"
    
    # Проверяем существование папки
    if not os.path.exists(music_dir):
        print(f"Создаём папку {music_dir}")
        os.makedirs(music_dir)
        return
    
    # Получаем список всех mp3 файлов
    tracks = []
    for filename in os.listdir(music_dir):
        if filename.lower().endswith('.mp3'):
            # Создаём имя трека без расширения и форматируем его
            name = os.path.splitext(filename)[0]
            name = name.replace('_', ' ').title()
            
            tracks.append({
                "name": name,
                "filename": os.path.join(music_dir, filename)
            })
    
    # Сортируем треки по имени
    tracks.sort(key=lambda x: x["name"])
    
    # Создаём JSON файл
    with open('tracks.json', 'w', encoding='utf-8') as f:
        json.dump({"tracks": tracks}, f, ensure_ascii=False, indent=4)
    
    print(f"Создан файл tracks.json с {len(tracks)} треками")

if __name__ == "__main__":
    generate_tracks_json() 