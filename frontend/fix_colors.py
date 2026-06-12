import os
import re

dir_path = 'src'

# Replacements for Tailwind classes
# We will use regex to find class names and replace them.
# We'll split the file content by quotes or spaces (actually, regex replacing the whole text is easier).

# Light mode replacements (without dark: prefix)
light_replacements = {
    r'(?<!dark:)text-gray-400': 'text-gray-600',
    r'(?<!dark:)text-slate-400': 'text-slate-600',
    r'(?<!dark:)text-zinc-400': 'text-zinc-600',
    r'(?<!dark:)text-gray-500': 'text-gray-700',
    r'(?<!dark:)text-slate-500': 'text-slate-700',
    r'(?<!dark:)text-zinc-500': 'text-zinc-700',
    r'(?<!dark:)text-gray-300': 'text-gray-500',
    r'(?<!dark:)text-slate-300': 'text-slate-500',
    r'(?<!dark:)text-zinc-300': 'text-zinc-500',
    
    r'(?<!dark:)border-gray-200': 'border-gray-300',
    r'(?<!dark:)border-slate-200': 'border-slate-300',
    r'(?<!dark:)border-gray-100': 'border-gray-300',
    r'(?<!dark:)border-slate-100': 'border-slate-300',
    r'(?<!dark:)border-gray-800': 'border-gray-900',
    r'(?<!dark:)border-white/10': 'border-white/20',
    r'(?<!dark:)border-white/20': 'border-white/30',

    r'(?<!dark:)bg-gray-50': 'bg-gray-100',
    r'(?<!dark:)bg-slate-50': 'bg-slate-100',
    r'(?<!dark:)bg-white/5': 'bg-white/10',
    r'(?<!dark:)bg-white/10': 'bg-white/20',
}

# Dark mode replacements (with dark: prefix)
dark_replacements = {
    r'(?<=dark:)text-gray-400': 'text-gray-300',
    r'(?<=dark:)text-slate-400': 'text-slate-300',
    r'(?<=dark:)text-zinc-400': 'text-zinc-300',
    r'(?<=dark:)text-gray-500': 'text-gray-300',
    r'(?<=dark:)text-slate-500': 'text-slate-300',
    r'(?<=dark:)text-zinc-500': 'text-zinc-300',
    r'(?<=dark:)text-gray-600': 'text-gray-400',
    r'(?<=dark:)text-slate-600': 'text-slate-400',

    r'(?<=dark:)border-gray-800': 'border-gray-600',
    r'(?<=dark:)border-slate-800': 'border-slate-600',
    r'(?<=dark:)border-gray-700': 'border-gray-600',
    r'(?<=dark:)border-slate-700': 'border-slate-600',
    r'(?<=dark:)border-white/5': 'border-white/20',
    r'(?<=dark:)border-white/10': 'border-white/20',
    
    r'(?<=dark:)bg-gray-800': 'bg-gray-900',
    r'(?<=dark:)bg-slate-800': 'bg-slate-900',
}

# Generic alpha text replacements
alpha_replacements = {
    r'text-white/40': 'text-white/60',
    r'text-white/50': 'text-white/70',
    r'text-white/60': 'text-white/80',
    r'text-white/70': 'text-white/90',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig_content = content
    
    # Apply regex replacements
    # Using \b to ensure whole word match for the class name
    for pattern, replacement in light_replacements.items():
        # we need to ensure the class ends at word boundary or quote/space
        content = re.sub(pattern + r'(?!\w|-)', replacement, content)
        
    for pattern, replacement in dark_replacements.items():
        content = re.sub(pattern + r'(?!\w|-)', replacement, content)

    for pattern, replacement in alpha_replacements.items():
        content = re.sub(pattern + r'(?!\w|-)', replacement, content)

    if content != orig_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

