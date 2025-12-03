// 简单的指板配置
const DEFAULT_CONFIG = {
    strings: 6,
    frets: 15,
    tuning: ['E', 'B', 'G', 'D', 'A', 'E']  // 现在这是从1弦到6弦的顺序
};

// 音符序列
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

//计算音符函数
function calculateNote(stringIndex, fret) {
    const openNote = DEFAULT_CONFIG.tuning[stringIndex];
    
    if (fret === 0) {
        return openNote;
    }
    
    const openNoteIndex = NOTES.indexOf(openNote);
    if (openNoteIndex === -1) {
        console.error('找不到音符:', openNote);
        return '?';
    }
    
    const noteIndex = (openNoteIndex + fret) % 12;
    return NOTES[noteIndex];
}

// 页面加载后执行
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('fretboardsContainer');
    
    // 初始创建2个指板
    createFretboard('指板1');
    createFretboard('指板2');
    
    // 添加指板按钮事件 - 现在会询问名称
    document.getElementById('addFretboard').addEventListener('click', function() {
        const name = prompt('请输入指板名称:', '新指板');
        if (name && name.trim() !== '') {
            createFretboard(name.trim());
        } else if (name !== null) {
            alert('指板名称不能为空！');
        }
    });
    
    // 清空所有按钮事件
    document.getElementById('clearAll').addEventListener('click', function() {
        if (confirm('确定要清空所有指板吗？')) {
            container.innerHTML = '';
        }
    });
    
    // 创建指板的函数
    function createFretboard(title) {
        const fretboard = document.createElement('div');
        fretboard.className = 'fretboard';
        
        fretboard.innerHTML = `
            <div class="fretboard-header">
                <div class="fretboard-title">${title}</div>
                <div class="fretboard-actions-top">
                    <button class="rename-btn" title="重命名">✏️</button>
                </div>
            </div>
            <div class="fretboard-grid">
                ${generateFretNumbers()}
                ${generateStrings()}
            </div>
            <div class="fretboard-actions">
                <button class="delete-btn">删除指板</button>
            </div>
        `;
        
        container.appendChild(fretboard);
        setupFretboardEvents(fretboard);
    }
    
    // 设置指板事件
    function setupFretboardEvents(fretboard) {
        setupFretClicks(fretboard);
        
        // 重命名按钮事件
        fretboard.querySelector('.rename-btn').addEventListener('click', function() {
            renameFretboard(fretboard);
        });
        
        // 删除按钮事件
        fretboard.querySelector('.delete-btn').addEventListener('click', function() {
            if (confirm('确定要删除这个指板吗？')) {
                fretboard.remove();
            }
        });
    }
    
    // 重命名指板函数
    function renameFretboard(fretboard) {
        const currentTitle = fretboard.querySelector('.fretboard-title').textContent;
        const newName = prompt('请输入新的指板名称:', currentTitle);
        if (newName && newName.trim() !== '') {
            fretboard.querySelector('.fretboard-title').textContent = newName.trim();
        } else if (newName !== null) {
            alert('指板名称不能为空！');
        }
    }
    
    // 生成品格数字
    function generateFretNumbers() {
        let numbersHTML = '<div class="fret-numbers">';
        for (let i = 0; i <= DEFAULT_CONFIG.frets; i++) {
            numbersHTML += `<div class="fret-number">${i}</div>`;
        }
        numbersHTML += '</div>';
        return numbersHTML;
    }
    
    // 生成琴弦
    function generateStrings() {
        let stringsHTML = '';
        for (let stringIndex = 0; stringIndex < DEFAULT_CONFIG.strings; stringIndex++) {
            const stringNumber = stringIndex + 1;
            stringsHTML += `
                <div class="string" data-string="${stringIndex}">
                    <div class="string-number">${stringNumber}</div>
                    ${generateFrets(stringIndex)}
                </div>`;
        }
        return stringsHTML;
    }
    
    // 生成品格
    function generateFrets(stringIndex) {
        let fretsHTML = '';
        for (let fretIndex = 0; fretIndex <= DEFAULT_CONFIG.frets; fretIndex++) {
            const note = calculateNote(stringIndex, fretIndex);
            fretsHTML += `
                <div class="fret" 
                     data-string="${stringIndex}" 
                     data-fret="${fretIndex}"
                     data-note="${note}">
                </div>
            `;
        }
        return fretsHTML;
    }
    
    // 设置品格点击事件
    function setupFretClicks(fretboard) {
        const frets = fretboard.querySelectorAll('.fret');
        frets.forEach(fret => {
            fret.addEventListener('click', function() {
                const isActive = this.classList.contains('active');
                
                if (isActive) {
                    this.classList.remove('active');
                    const existingNote = this.querySelector('.note-name');
                    if (existingNote) {
                        existingNote.remove();
                    }
                } else {
                    this.classList.add('active');
                    
                    const noteName = document.createElement('div');
                    noteName.className = 'note-name';
                    noteName.textContent = this.dataset.note;
                    this.appendChild(noteName);
                    
                    const stringNum = parseInt(this.dataset.string) + 1;
                    console.log(`${stringNum}弦, ${this.dataset.fret}品: ${this.dataset.note}`);
                }
            });
        });
    }
});