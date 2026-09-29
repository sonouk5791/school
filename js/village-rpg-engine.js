/**
 * Lilac Village 2.5D Life RPG Walking & Interaction Engine
 * Digital AI School - Gentle, Accessible Walking RPG for Seniors
 */
(function() {
  'use strict';

  const VillageRPG = {
    state: {
      currentLocation: 'shelter',
      isWalking: false,
      todayRewards: { flowers: 0, balloons: 0, bookmarks: 0, notes: 0, sprouts: 0 },
      completedTasks: []
    },

    destinations: {
      shelter: {
        name: '라일락 마을 쉼터',
        title: '라일락 마을 쉼터',
        dialog: '“라일락 마을 쉼터에서 잠시 쉬어가요. 맑은 공기와 향긋한 라일락 향기가 가득해요.”',
        charId: null,
        url: null,
        coords: { x: 50, y: 50 },
        actions: [
          { text: '🌸 친구들 이야기 듣기', action: 'rest_intro' },
          { text: '🌱 텃밭으로 산책하기', action: 'walk_garden' },
          { text: '🏡 마을 둘러보기', action: 'close' }
        ]
      },
      kongi: {
        name: '콩이집',
        role: '운동방',
        title: '콩이집 · 운동방',
        dialog: '“어서 오세요! 오늘 저랑 신나게 몸을 움직여볼까요?”',
        charId: 'kongi',
        charName: '콩이',
        url: 'senior-exercise.html',
        coords: { x: 26, y: 28 },
        actions: [
          { text: '🏃 오늘의 체조 시작하기', url: 'senior-exercise.html', isPrimary: true },
          { text: '📋 다른 운동 목록 보기', url: 'catalog.html#kongi' },
          { text: '🏡 마을로 돌아가기', action: 'close' }
        ]
      },
      tori: {
        name: '토리집',
        role: '놀이방',
        title: '토리집 · 놀이방',
        dialog: '“어서 와요! 오늘은 재미있는 놀이와 퍼즐을 함께 해봐요.”',
        charId: 'tori',
        charName: '토리',
        url: 'tori-play.html',
        coords: { x: 74, y: 28 },
        actions: [
          { text: '🧩 오늘의 대표 놀이하기', url: 'tori-play.html', isPrimary: true },
          { text: '🎨 다른 놀이 목록 보기', url: 'catalog.html#tori' },
          { text: '🏡 마을로 돌아가기', action: 'close' }
        ]
      },
      nabi: {
        name: '나비집',
        role: '학습방',
        title: '나비집 · 학습방',
        dialog: '“천천히 차분하게 기억과 배움 이야기를 나눠볼까요?”',
        charId: 'nabi',
        charName: '나비',
        url: 'nabi-learn.html',
        coords: { x: 26, y: 72 },
        actions: [
          { text: '📖 오늘의 기억 활동하기', url: 'nabi-learn.html', isPrimary: true },
          { text: '💡 다른 배움 목록 보기', url: 'catalog.html#nabi' },
          { text: '🏡 마을로 돌아가기', action: 'close' }
        ]
      },
      bori: {
        name: '보리집',
        role: '취미방',
        title: '보리집 · 취미방',
        dialog: '“반가워요! 오늘은 정겨운 옛 노래와 추억 이야기를 즐겨봐요.”',
        charId: 'bori',
        charName: '보리',
        url: 'bori-hobby.html',
        coords: { x: 74, y: 72 },
        actions: [
          { text: '🎵 오늘의 대표 노래 듣기', url: 'bori-hobby.html', isPrimary: true },
          { text: '📻 다른 노래 목록 보기', url: 'catalog.html#bori' },
          { text: '🏡 마을로 돌아가기', action: 'close' }
        ]
      },
      garden: {
        name: '우리 텃밭',
        title: '우리 텃밭 · 어르신댁',
        dialog: '“싱그러운 채소와 꽃들이 자라고 있어요. 물을 주고 가꾸어볼까요?”',
        charId: null,
        url: 'our-home.html#garden',
        coords: { x: 14, y: 88 },
        actions: [
          { text: '🌱 텃밭 가꾸러 가기', url: 'our-home.html#garden', isPrimary: true },
          { text: '🏡 우리 집 마당 둘러보기', url: 'our-home.html' },
          { text: '🌸 마을로 돌아가기', action: 'close' }
        ]
      }
    },

    init(grid) {
      if (!grid) return;
      this.grid = grid;
      this.loadSavedState();
      this.setupWalkerAvatar();
      this.setupDialogModal();
      this.setupTasksAndRewards();
      this.attachEventListeners();
    },

    loadSavedState() {
      try {
        const d = new Date().toISOString().slice(0, 10);
        const completed = JSON.parse(localStorage.getItem('school_today_completed_chars') || '{}')[d] || [];
        this.state.completedTasks = completed;
        this.state.todayRewards.flowers = completed.includes('kongi') ? 1 : 0;
        this.state.todayRewards.balloons = completed.includes('tori') ? 1 : 0;
        this.state.todayRewards.bookmarks = completed.includes('nabi') ? 1 : 0;
        this.state.todayRewards.notes = completed.includes('bori') ? 1 : 0;
      } catch (e) {
        console.warn('RPG state load error', e);
      }
    },

    setupWalkerAvatar() {
      let walker = this.grid.querySelector('.village-walker');
      if (!walker) {
        walker = document.createElement('div');
        walker.className = 'village-walker';
        walker.setAttribute('aria-hidden', 'true');
        walker.innerHTML = `
          <div class="walker-avatar">
            <span class="walker-shadow"></span>
            <span class="walker-body">🚶‍♂️</span>
            <span class="walker-footprint">👣</span>
          </div>
        `;
        this.grid.appendChild(walker);
      }
      this.walker = walker;
      this.updateWalkerPos('shelter', false);
    },

    setupDialogModal() {
      let modal = document.getElementById('villageRpgDialog');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'villageRpgDialog';
        modal.className = 'village-rpg-dialog-backdrop';
        modal.hidden = true;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
          <div class="village-rpg-dialog-card">
            <div class="rpg-dialog-header">
              <span class="rpg-dialog-roof-badge" id="rpgDialogBadge">라일락 마을</span>
              <button type="button" class="rpg-dialog-close" id="rpgDialogClose" aria-label="닫기">✕</button>
            </div>
            <div class="rpg-dialog-body">
              <div class="rpg-dialog-character" id="rpgDialogChar">
                <span class="rpg-char-icon" id="rpgCharIcon">🏡</span>
              </div>
              <div class="rpg-dialog-content">
                <h3 class="rpg-dialog-title" id="rpgDialogTitle">콩이집 · 운동방</h3>
                <p class="rpg-dialog-text" id="rpgDialogText">“어서 오세요! 오늘 저랑 몸을 움직여볼까요?”</p>
              </div>
            </div>
            <div class="rpg-dialog-actions" id="rpgDialogActions"></div>
          </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#rpgDialogClose').onclick = () => this.closeDialog();
        modal.onclick = (e) => {
          if (e.target === modal) this.closeDialog();
        };
      }
      this.dialogModal = modal;
    },

    setupTasksAndRewards() {
      let questContainer = document.querySelector('.village-rpg-quest-container');
      if (!questContainer) {
        questContainer = document.createElement('div');
        questContainer.className = 'village-rpg-quest-container';
        questContainer.innerHTML = `
          <div class="rpg-quest-card">
            <div class="quest-header">
              <span class="quest-icon">📋</span>
              <strong class="quest-title">오늘의 라일락 마을 산책</strong>
              <span class="quest-sub">좋아하는 친구 집을 터치해서 산책해보세요!</span>
            </div>
            <div class="quest-list">
              <span class="quest-item ${this.state.completedTasks.includes('kongi') ? 'is-done' : ''}">🌼 콩이와 체조</span>
              <span class="quest-item ${this.state.completedTasks.includes('tori') ? 'is-done' : ''}">🎈 토리와 놀이</span>
              <span class="quest-item ${this.state.completedTasks.includes('nabi') ? 'is-done' : ''}">🔖 나비와 기억</span>
              <span class="quest-item ${this.state.completedTasks.includes('bori') ? 'is-done' : ''}">🎵 보리와 노래</span>
              <span class="quest-item">🌱 텃밭 산책</span>
            </div>
          </div>
        `;
        const friendRooms = document.getElementById('friendRooms');
        if (friendRooms) {
          friendRooms.insertBefore(questContainer, this.grid);
        }
      }
    },

    attachEventListeners() {
      // 4 Character Houses
      this.grid.querySelectorAll('.home-friend').forEach(card => {
        const destKey = card.dataset.room;
        card.addEventListener('click', (e) => {
          e.preventDefault();
          this.walkTo(destKey);
        });
      });

      // Central Shelter
      const shelter = this.grid.querySelector('.village-rest');
      if (shelter) {
        shelter.addEventListener('click', (e) => {
          e.preventDefault();
          this.walkTo('shelter');
        });
      }

      // Garden Sign
      const garden = this.grid.querySelector('.village-garden-sign');
      if (garden) {
        garden.addEventListener('click', (e) => {
          e.preventDefault();
          this.walkTo('garden');
        });
      }
    },

    updateWalkerPos(destKey, animate = true) {
      const dest = this.destinations[destKey];
      if (!dest || !this.walker) return;

      const targetX = dest.coords.x;
      const targetY = dest.coords.y;

      if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.walker.style.transition = 'none';
        this.walker.style.left = `${targetX}%`;
        this.walker.style.top = `${targetY}%`;
        this.state.currentLocation = destKey;
        return;
      }

      this.state.isWalking = true;
      this.walker.classList.add('is-walking');
      this.walker.style.transition = 'all 1.4s cubic-bezier(0.25, 1, 0.5, 1)';
      this.walker.style.left = `${targetX}%`;
      this.walker.style.top = `${targetY}%`;

      setTimeout(() => {
        this.walker.classList.remove('is-walking');
        this.state.isWalking = false;
        this.state.currentLocation = destKey;
      }, 1450);
    },

    walkTo(destKey) {
      if (this.state.isWalking) return;
      const dest = this.destinations[destKey];
      if (!dest) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.updateWalkerPos(destKey, !reduced);

      const delay = reduced ? 50 : 1500;
      setTimeout(() => {
        this.showDestinationDialog(destKey);
      }, delay);
    },

    showDestinationDialog(destKey) {
      const dest = this.destinations[destKey];
      if (!dest || !this.dialogModal) return;

      const charIcons = { kongi: '🐶', tori: '🐰', nabi: '🐱', bori: '🐻', shelter: '🌸', garden: '🌱' };
      const charColors = { kongi: '#e89c36', tori: '#e47b97', nabi: '#8c7eb8', bori: '#48989e', shelter: '#a878d6', garden: '#6a9c42' };

      document.getElementById('rpgDialogBadge').textContent = dest.role ? `${dest.name} · ${dest.role}` : dest.name;
      document.getElementById('rpgDialogTitle').textContent = dest.title;
      document.getElementById('rpgDialogText').textContent = dest.dialog;
      document.getElementById('rpgCharIcon').textContent = charIcons[destKey] || '🏡';
      document.getElementById('rpgDialogBadge').style.background = charColors[destKey] || '#8a6840';

      const actionsContainer = document.getElementById('rpgDialogActions');
      actionsContainer.innerHTML = '';

      dest.actions.forEach(act => {
        if (act.url) {
          const btn = document.createElement('a');
          btn.href = act.url;
          btn.className = `rpg-dialog-btn ${act.isPrimary ? 'is-primary' : 'is-secondary'}`;
          btn.innerHTML = `${act.text} ➔`;
          actionsContainer.appendChild(btn);
        } else {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'rpg-dialog-btn is-secondary';
          btn.textContent = act.text;
          btn.onclick = () => {
            if (act.action === 'walk_garden') {
              this.closeDialog();
              this.walkTo('garden');
            } else if (act.action === 'rest_intro') {
              this.speakShelterIntro();
            } else {
              this.closeDialog();
            }
          };
          actionsContainer.appendChild(btn);
        }
      });

      this.dialogModal.hidden = false;
      this.dialogModal.classList.add('is-open');

      // Wave greeting if character card exists
      if (dest.charId) {
        const card = this.grid.querySelector(`.home-friend-${dest.charId}`);
        if (card) {
          card.classList.add('is-introducing');
          setTimeout(() => card.classList.remove('is-introducing'), 3000);
        }
      }
    },

    speakShelterIntro() {
      document.getElementById('rpgDialogText').textContent = '“콩이는 건강체조를, 토리는 재미있는 놀이를, 나비는 깊은 생각을, 보리는 옛 노래를 준비하고 있어요. 마음에 드는 친구 집에 편안하게 놀러 가보세요!”';
    },

    closeDialog() {
      if (!this.dialogModal) return;
      this.dialogModal.classList.remove('is-open');
      setTimeout(() => {
        this.dialogModal.hidden = true;
      }, 200);
    }
  };

  window.VillageRPG = VillageRPG;
})();
