// projekt/cards/tags-card.js - SU PIN FUNKCIONALUMU

// =============================================================================
// TAGS KORTELĖ - SU PIN FUNKCIONALUMU
// =============================================================================

class TagsCard {
    constructor() {
        this.name = 'tags';
        this.selectedTags = new Set();
        this.element = null;
        this.app = null;
        this.isPinnedState = false;
    }

    init(app) {
        this.app = app;
        
        this.element = document.querySelector('[data-card="tags"]');
        if (!this.element) {
            return;
        }

        this.generateUI();
        this.setupEvents();
        this.updatePreview();
        this.loadPinnedState();
    }

    generateUI() {
        // Pridėti pin mygtuką į header
        this.addPinButton();
        
        const container = this.element.querySelector('#tagsCategories');
        
        if (!container) {
            return;
        }
        
        if (!window.DATA) {
            container.innerHTML = '<div>⛔ Nerasti duomenys (window.DATA)</div>';
            return;
        }
        
        if (!window.DATA.TAGS) {
            container.innerHTML = '<div>⛔ Nerasti tagų duomenys (DATA.TAGS)</div>';
            return;
        }

        container.innerHTML = '';

        // Sukurti kategorijas
        Object.entries(window.DATA.TAGS).forEach(([categoryKey, tags]) => {
            const section = document.createElement('div');
            section.className = 'category-section';
            
            // Antraštė su arrow - pradžioje suskleista
            const title = document.createElement('div');
            title.className = 'category-title collapsed';
            title.innerHTML = `
                <span>${this.formatCategory(categoryKey)}</span>
            `;
            title.onclick = () => this.toggleCategory(title, tagsDiv);
            
            // Tagų konteineris - pradžioje paslėptas
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'category-tags collapsed';
            
            // Tagų mygtukai
            tags.forEach(tag => {
                const btn = document.createElement('button');
                btn.className = 'tag-button';
                btn.textContent = tag;
                btn.onclick = () => this.toggleTag(tag, btn);
                tagsDiv.appendChild(btn);
            });
            
            section.appendChild(title);
            section.appendChild(tagsDiv);
            container.appendChild(section);
        });

        // PAKEISTA: Pridėti global-preview-section vietoj tags-preview-section
        const cardContent = this.element.querySelector('.card-content');
        const existingPreview = cardContent.querySelector('.tags-preview-section, .global-preview-section');
        
        if (!existingPreview) {
            const previewSection = document.createElement('div');
            previewSection.className = 'global-preview-section';
            previewSection.innerHTML = `
                <div class="preview-title">TaskWarrior Tags Preview:</div>
                <div class="command-output" id="tagsCommandOutput">
                    <span class="no-command">Nepasirinkti jokie tagų laukai</span>
                </div>
                <div id="selectedTagsList"></div>
            `;
            cardContent.appendChild(previewSection);
        }
    }

    formatCategory(key) {
        return key.charAt(0) + key.slice(1).toLowerCase();
    }

    toggleCategory(titleEl, tagsEl) {
        const isCollapsed = tagsEl.classList.contains('collapsed');
        
        // ACCORDION LOGIKA: Pirma uždarome visas kategorijas
        this.closeAllCategories();
        
        // Jei paspausdami kategorija buvo uždaryta - atidarome ją
        if (isCollapsed) {
            tagsEl.classList.remove('collapsed');
            titleEl.classList.remove('collapsed');
        }
        // Jei kategorija buvo atidaryta - ji jau užsidarė closeAllCategories() metu
        // Nieko nedarome - kategorija lieka uždaryta (accordion effect)
    }

    // Uždaryti visas kategorijas
    closeAllCategories() {
        // Surasti visas kategorijas element'e
        const allTitles = this.element.querySelectorAll('.category-title');
        const allTags = this.element.querySelectorAll('.category-tags');
        
        // Uždaryti visas kategorijas
        allTitles.forEach(title => {
            title.classList.add('collapsed');
        });
        
        allTags.forEach(tags => {
            tags.classList.add('collapsed');
        });
    }

    toggleTag(tagName, button) {
        if (this.selectedTags.has(tagName)) {
            this.selectedTags.delete(tagName);
            button.classList.remove('selected');
        } else {
            this.selectedTags.add(tagName);
            button.classList.add('selected');
        }
        
        this.updatePreview();
        this.updateState();
        
        // Jei pinned - atnaujinti pinned value
        if (this.isPinnedState && window.StorageManager) {
            window.StorageManager.updatePinnedValue('tags', this.getValue());
        }
    }

    updatePreview() {
        // Atnaujinti tags command output - PAKEISTA LOGIKA
        const outputEl = document.getElementById('tagsCommandOutput');
        if (outputEl) {
            // Išvalyti turinį
            outputEl.innerHTML = '';
            
            if (this.selectedTags.size === 0) {
                outputEl.innerHTML = '<span class="no-command">Nepasirinkti jokie tagų laukai</span>';
                outputEl.classList.remove('has-command');
            } else {
                // Vietoj komandos, rodyti tagų mygtukus
                outputEl.classList.add('has-command');
                
                // Sukurti tagų mygtukai konteinerį
                const tagsContainer = document.createElement('div');
                tagsContainer.className = 'preview-tags-container';
                
                this.selectedTags.forEach(tag => {
                    const tagButton = document.createElement('div');
                    tagButton.className = 'preview-tag-button';
                    tagButton.innerHTML = `
                        <span class="tag-name">${tag}</span>
                        <span class="tag-remove" onclick="tagsCard.removeTag('${tag}')" title="Pašalinti tagą">×</span>
                    `;
                    tagsContainer.appendChild(tagButton);
                });
                
                outputEl.appendChild(tagsContainer);
            }
        }

        // Palikti originalų selected tags list (jei reikia)
        const container = this.element.querySelector('#selectedTagsList');
        if (container) {
            container.innerHTML = '';

            if (this.selectedTags.size === 0) {
                container.innerHTML = '<span class="no-tags-message">Nepasirinkta jokių tagų</span>';
            } else {
                this.selectedTags.forEach(tag => {
                    const item = document.createElement('span');
                    item.className = 'selected-tag-item';
                    item.innerHTML = `${tag} <span class="selected-tag-remove" onclick="tagsCard.removeTag('${tag}')">×</span>`;
                    container.appendChild(item);
                });
            }
        }
    }

    removeTag(tagName) {
        this.selectedTags.delete(tagName);
        
        // Atnaujinti mygtuką
        const buttons = this.element.querySelectorAll('.tag-button');
        buttons.forEach(button => {
            if (button.textContent.trim() === tagName) {
                button.classList.remove('selected');
            }
        });
        
        this.updatePreview();
        this.updateState();
        
        // Jei pinned - atnaujinti pinned value
        if (this.isPinnedState && window.StorageManager) {
            window.StorageManager.updatePinnedValue('tags', this.getValue());
        }
    }

    updateState() {
        if (this.app) {
            const tags = Array.from(this.selectedTags);
            this.app.updateState('currentTask.tags', tags);
        }
    }

    setupEvents() {
        // Paprastas setup - pagrindinė logika jau onclick
    }

    // =============================================================================
    // PIN FUNKCIONALUMAS
    // =============================================================================

    addPinButton() {
        const header = this.element.querySelector('.card-header');
        if (!header || header.querySelector('.pin-btn')) return;

        const pinBtn = document.createElement('button');
        pinBtn.className = 'pin-btn';
        pinBtn.textContent = '📌';
        pinBtn.title = 'Prisegti kortelę';
        
        // PAKEISTA: vietoj onclick naudojame addEventListener
        pinBtn.addEventListener('click', () => {
            console.log('TAGS PIN: mygtukas paspaustas!');
            this.togglePin();
        });

        // TAISYMAS: įdėti PRIEŠ help mygtuką
        const helpBtn = header.querySelector('.help-btn');
        if (helpBtn) {
            header.insertBefore(pinBtn, helpBtn);
        } else {
            header.appendChild(pinBtn);
        }
    }

    togglePin() {
        this.isPinnedState = !this.isPinnedState;
        
        if (window.StorageManager) {
            const currentValue = this.isPinnedState ? this.getValue() : null;
            window.StorageManager.setPinned('tags', this.isPinnedState, currentValue);
        }

        this.updatePinVisuals();
    }

    updatePinVisuals() {
        const header = this.element.querySelector('.card-header');
        const pinBtn = header.querySelector('.pin-btn');
        
        if (this.isPinnedState) {
            header.classList.add('pinned');
            pinBtn.classList.add('pinned');
        } else {
            header.classList.remove('pinned');
            pinBtn.classList.remove('pinned');
        }
    }

    loadPinnedState() {
        if (window.StorageManager) {
            this.isPinnedState = window.StorageManager.isPinned('tags');
            
            if (this.isPinnedState) {
                const pinnedValue = window.StorageManager.getPinnedValue('tags');
                if (pinnedValue && pinnedValue.length > 0) {
                    pinnedValue.forEach(tag => this.selectedTags.add(tag));
                    this.updateTagButtons();
                    this.updatePreview();
                    this.updateState();
                }
            }
            
            this.updatePinVisuals();
        }
    }

    updateTagButtons() {
        // Atnaujinti visų tagų mygtukų selected būseną
        this.element.querySelectorAll('.tag-button').forEach(btn => {
            if (this.selectedTags.has(btn.textContent)) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }

    clearForm() {
        if (!this.isPinnedState) {
            this.selectedTags.clear();
            this.updateTagButtons();
            this.updatePreview();
            this.updateState();
        }
    }

    // =============================================================================
    // PAGRINDINĖS FUNKCIJOS
    // =============================================================================

    getValue() {
        return Array.from(this.selectedTags);
    }

    generateTaskWarriorCommand() {
        if (this.selectedTags.size === 0) return '';
        return Array.from(this.selectedTags).map(tag => `+${tag}`).join(' ');
    }
}

// =============================================================================
// REGISTRACIJA
// =============================================================================

let tagsCard;

document.addEventListener('DOMContentLoaded', () => {
    tagsCard = new TagsCard();
    
    if (window.registerCard) {
        window.registerCard('tags', tagsCard);
    } else {
        setTimeout(() => {
            if (window.registerCard) {
                window.registerCard('tags', tagsCard);
            }
        }, 500);
    }
});