import os

app_dir = 'app'
tsx_files = []
for root, dirs, files in os.walk(app_dir):
    for f in files:
        if f.endswith('.tsx'):
            tsx_files.append(os.path.join(root, f))

# Comprehensive Unicode-to-ASCII replacement map
REPLACEMENTS = [
    # Copyright, section, registered
    ('\u00a9', '(c)'),
    ('\u00a7', 'Section'),
    ('\u00ae', '(R)'),
    ('\u00b0', 'deg'),
    ('\u00d7', 'x'),
    # Arrows
    ('\u2190', '<-'),
    ('\u2192', '->'),
    ('\u2191', '^'),
    ('\u2193', 'v'),
    # Dashes and quotes
    ('\u2014', '--'),
    ('\u2013', '-'),
    ('\u2018', "'"),
    ('\u2019', "'"),
    ('\u201c', '"'),
    ('\u201d', '"'),
    ('\u2022', '*'),
    # Math
    ('\u2264', '<='),
    ('\u2265', '>='),
    ('\u2260', '!='),
    ('\u00bd', '1/2'),
    ('\u00bc', '1/4'),
    ('\u00be', '3/4'),
    # Symbols
    ('\u26a0', '[!]'),
    ('\u2696', '[scales]'),
    ('\u25cf', '*'),
    ('\u25e6', '*'),
    ('\u2713', '[check]'),
    ('\u2714', '[check]'),
    ('\u2715', 'x'),
    ('\u2716', 'x'),
    ('\ufffd', ''),
    # Emoji - 4 byte
    ('\U0001f4ca', '[chart]'),
    ('\U0001f4cd', '[pin]'),
    ('\U0001f4c8', '[trending]'),
    ('\U0001f4c9', '[chart-down]'),
    ('\U0001f3e0', '[house]'),
    ('\U0001f464', '[user]'),
    ('\U0001f465', '[users]'),
    ('\U0001f91d', '[handshake]'),
    ('\U0001f4b0', '[money]'),
    ('\U0001f525', '[fire]'),
    ('\U0001f4a1', '[idea]'),
    ('\U0001f916', '[robot]'),
    ('\U0001f310', '[globe]'),
    ('\U0001f512', '[lock]'),
    ('\U0001f6e1', '[shield]'),
    ('\U0001f4dd', '[note]'),
    ('\U0001f4bc', '[briefcase]'),
    ('\U0001f50d', '[search]'),
    ('\U0001f4f1', '[phone]'),
    ('\U0001f4e7', '[email]'),
    ('\U0001f3af', '[target]'),
    ('\U0001f4de', '[phone]'),
    ('\U0001f4c5', '[calendar]'),
    ('\U0001f517', '[link]'),
    ('\U0001f4a5', '[boom]'),
    ('\U0001f4af', '[100]'),
    ('\U0001f44d', '[+1]'),
    ('\U0001f44f', '[clap]'),
    ('\U0001f680', '[rocket]'),
    ('\U0001f4b3', '[card]'),
    ('\U0001f3db', '[building]'),
    ('\U0001f4f0', '[news]'),
    ('\U0001f4ac', '[chat]'),
    ('\U0001f527', '[tool]'),
    ('\U0001f6a7', '[construction]'),
    ('\U0001f9e9', '[puzzle]'),
    ('\U0001f9f0', '[toolbox]'),
    ('\U0001f3e6', '[bank]'),
    ('\U0001f4d6', '[book]'),
    ('\U0001f4d8', '[book]'),
    ('\U0001f4d2', '[ledger]'),
    ('\U0001f9fe', '[receipt]'),
    ('\U0001f4c4', '[doc]'),
    ('\U0001f4e4', '[inbox]'),
    ('\U0001f4e5', '[outbox]'),
    ('\U0001f4e6', '[package]'),
    ('\U0001f5c2', '[files]'),
    ('\U0001f4bb', '[laptop]'),
    ('\U0001f4f7', '[camera]'),
    ('\U0001f514', '[bell]'),
    ('\U0001f515', '[no-bell]'),
    ('\U0001f4e2', '[megaphone]'),
    ('\U0001f4e3', '[megaphone]'),
    ('\U0001f6d2', '[cart]'),
    ('\U0001f4c1', '[folder]'),
    ('\U0001f4c2', '[open-folder]'),
    ('\U0001f4c3', '[page]'),
    ('\U0001f4ce', '[paperclip]'),
    ('\U0001f4cf', '[ruler]'),
    ('\U0001f4d0', '[triangle-ruler]'),
    ('\U0001f4d1', '[bookmark]'),
    ('\U0001f4d3', '[notebook]'),
    ('\U0001f4d4', '[notebook]'),
    ('\U0001f4d5', '[notebook]'),
    ('\U0001f4d7', '[book]'),
    ('\U0001f4d9', '[book]'),
    ('\U0001f4da', '[books]'),
    ('\U0001f4db', '[card-index]'),
    ('\U0001f4dc', '[scroll]'),
    ('\U0001f4df', '[pager]'),
    ('\U0001f4e0', '[fax]'),
    ('\U0001f4e1', '[satellite]'),
    ('\U0001f3a4', '[mic]'),
    ('\U0001f3a7', '[headphones]'),
    ('\U0001f50a', '[speaker]'),
    ('\U0001f91d', '[handshake]'),
]

fixed_count = 0
for fpath in tsx_files:
    with open(fpath, 'rb') as f:
        raw = f.read()
    
    if all(b < 128 for b in raw):
        print('SKIP (clean): ' + fpath)
        continue
    
    # Decode with replacement for bad bytes
    content = raw.decode('utf-8', errors='replace')
    
    # Apply all replacements
    for uni_char, ascii_equiv in REPLACEMENTS:
        content = content.replace(uni_char, ascii_equiv)
    
    # Strip any remaining non-ASCII (encode to ASCII, ignore errors)
    content_ascii = content.encode('ascii', errors='ignore').decode('ascii')
    
    orig_non_ascii = sum(1 for b in raw if b > 127)
    
    with open(fpath, 'wb') as f:
        f.write(content_ascii.encode('ascii'))
    
    print('FIXED: ' + fpath + ' (' + str(orig_non_ascii) + ' non-ASCII bytes removed)')
    fixed_count += 1

print('\nDone. Fixed ' + str(fixed_count) + ' files.')
