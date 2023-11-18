import os
import json
import zipfile

def zip_files_and_folders(file_paths, zip_name):
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_path in file_paths:
            if os.path.isdir(file_path):
                for root, dirs, files in os.walk(file_path):
                    for file in files:
                        zipf.write(os.path.join(root, file), os.path.relpath(os.path.join(root, file), os.path.dirname(file_path)))
            else:
                zipf.write(file_path, os.path.basename(file_path))

def list_files_and_subdirectories(directory, output_dict):
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.relpath(os.path.join(root, file), directory)
            if not file_path.endswith('png') and not file_path.endswith('gif'):
                output_dict["additionFile"].append('img/' + file_path.replace("\\", "/"))
            else:
                output_dict["imgFileList"].append('img/' + file_path.replace("\\", "/"))

os.makedirs('img', exist_ok=True)
output_dict = {}
output_dict['name'] = input('请输入模组名称:')
output_dict['version'] = input('请输入类似于1.0.0的模组版本号:')
print(f'模组生成中请稍等...')
output_dict['styleFileList'] = []
output_dict['scriptFileList'] = []
output_dict['tweeFileList'] = []
output_dict['additionFile'] = []
output_dict['imgFileList'] = []
list_files_and_subdirectories('img', output_dict)
output_dict['addonPlugin'] = [
    {
      "modName": "ModLoader DoL ImageLoaderHook",
      "addonName": "ImageLoaderAddon",
      "modVersion": "^2.3.0",
      "params": [
      ]
    }
  ]
output_dict['dependenceInfo'] = [
    {
      "modName": "ModLoader DoL ImageLoaderHook",
      "version": "^2.3.0"
    }
  ]

# 将内容输出到文本文件
with open('boot.json', 'w', encoding='utf-8') as file:
    json.dump(output_dict, file, indent=2, ensure_ascii=False)

# 要压缩的文件和文件夹路径列表
file_paths = ['img', 'boot.json']  
# 压缩后的文件名
zip_name = output_dict['name'] + '.zip'

zip_files_and_folders(file_paths, zip_name)
os.remove('boot.json')
print(f'模组生成完成: {zip_name}')
