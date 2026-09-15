/**
 * ?”ì????™êµ - ?´ë¥´???„ë¡œ??ê´€ë¦?+ ê°œì¸?•ë³´ ?™ì˜ ë°?Room) ?±ë¡ ëª¨ë“ˆ
 *
 * ê¸°ëŠ¥:
 *  - ?´ë¥´??ëª©ë¡ ì¹´ë“œ + ?„ë¡œ???¸ì§‘ ?¨ë„
 *  - ê°œì¸?•ë³´ ?™ì˜ ì¹´ë“œ 4ì¢?(ê¸°ì¡´ UI ? ì?)
 *  - ê°?ì¹´ë“œ ?´ë¦­ ????ª©ë³??„ìš© ë°?Room) ?¬ë¼?´ë“œ ?¤í”ˆ ???¸ë? ?ë£Œ ?±ë¡/?€?? *  - localStorage ê¸°ë°˜ ?€?? */

(function () {
  'use strict';

  /* ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??     1. ?ìˆ˜ & ë©”í? ?°ì´??     ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??*/
  const STORAGE_KEY = 'digitalSchool_userProfiles';

  const CONSENT_ITEMS = [
    { id: 'consent-personal', label: 'ê°œì¸?•ë³´ ?™ì˜' },
    { id: 'consent-guardian', label: 'ë³´í˜¸???™ì˜' },
    { id: 'consent-program',  label: '?„ë¡œê·¸ë¨ ì°¸ì—¬ ?™ì˜' },
    { id: 'consent-photo',    label: '?¬ì§„ ?œìš© ?™ì˜' },
  ];

  const CONSENT_META = {
    'consent-personal': { icon: '?”’', fullTitle: 'ê°œì¸?•ë³´ ?™ì˜' },
    'consent-guardian': { icon: '?‘¨?ğŸ‘©â€ğŸ‘?, fullTitle: 'ë³´í˜¸???™ì˜' },
    'consent-program':  { icon: '?“‹', fullTitle: '?„ë¡œê·¸ë¨ ì°¸ì—¬ ?™ì˜' },
    'consent-photo':    { icon: '?“·', fullTitle: '?¬ì§„ ?œìš© ?™ì˜' },
  };

  /* ê°?ë°?Room)???…ë ¥ ?„ë“œ ?•ì˜ */
  const ROOM_FIELDS = {
    'consent-personal': {
      color: 'orange',
      desc: '?˜ì§‘?˜ëŠ” ê°œì¸?•ë³´ ??ª©ê³??™ì˜ ?´ìš©???…ë ¥??ì£¼ì„¸??',
      fields: [
        { type: 'date',     id: 'rp-date',     label: '?™ì˜?¼ì' },
        { type: 'checkbox-group', id: 'rp-items', label: '?˜ì§‘ ??ª©',
          options: ['?±ëª…', '?ë…„?”ì¼', 'ì£¼ì†Œ', '?°ë½ì²?, 'ê±´ê°•?•ë³´', '?¬ì§„Â·?ìƒ'] },
        { type: 'select',   id: 'rp-period',   label: 'ë³´ìœ ê¸°ê°„',
          options: ['1??, '2??, '3??, '5??, '?œë¹„??ì¢…ë£Œ ?œê¹Œì§€'] },
        { type: 'textarea', id: 'rp-memo',     label: 'ë©”ëª¨', placeholder: '?¹ì´?¬í•­???…ë ¥?˜ì„¸??' },
      ],
    },
    'consent-guardian': {
      color: 'green',
      desc: 'ë³´í˜¸???•ë³´?€ ?™ì˜ ?´ìš©???±ë¡??ì£¼ì„¸??',
      fields: [
        { type: 'text',   id: 'rg-name',     label: 'ë³´í˜¸???±í•¨',   placeholder: '?ê¸¸?? },
        { type: 'select', id: 'rg-relation', label: 'ê´€ê³?,
          options: ['ë°°ìš°??, '?ë?', '?ì?€', '?•ì œÂ·?ë§¤', 'ê¸°í? ì¹œì¡±', '?„ê²¬??] },
        { type: 'tel',    id: 'rg-phone',    label: '?°ë½ì²?,        placeholder: '010-0000-0000' },
        { type: 'date',   id: 'rg-date',     label: '?™ì˜?¼ì' },
        { type: 'textarea', id: 'rg-memo',   label: 'ë©”ëª¨', placeholder: '?¹ì´?¬í•­???…ë ¥?˜ì„¸??' },
      ],
    },
    'consent-program': {
      color: 'yellow',
      desc: 'ì°¸ì—¬???™ì˜?˜ëŠ” ?„ë¡œê·¸ë¨ ? í˜•??? íƒ??ì£¼ì„¸??',
      fields: [
        { type: 'date',           id: 'rpr-date',  label: '?™ì˜?¼ì' },
        { type: 'checkbox-group', id: 'rpr-types', label: 'ì°¸ì—¬ ?„ë¡œê·¸ë¨',
          options: ['?¸ì??œë™ ?„ë¡œê·¸ë¨', '? ì²´?œë™ ?„ë¡œê·¸ë¨', 'ë¬¸í™”Â·?¬ê? ?„ë¡œê·¸ë¨',
                    '?¬íšŒ?œë™ ?„ë¡œê·¸ë¨', '?ê²© AI ?˜ì—…', '?¸ë? ?˜ë“¤???œë™'] },
        { type: 'text',     id: 'rpr-place',  label: '?¥ì†Œ',    placeholder: '?? ë³µì?ê´€ 3ì¸?ê°•ë‹¹' },
        { type: 'textarea', id: 'rpr-memo',   label: 'ë©”ëª¨',    placeholder: '?¹ì´?¬í•­???…ë ¥?˜ì„¸??' },
      ],
    },
    'consent-photo': {
      color: 'sage',
      desc: '?¬ì§„Â·?ìƒ ì´¬ì˜ ë°??œìš© ë²”ìœ„???™ì˜??ì£¼ì„¸??',
      fields: [
        { type: 'date',           id: 'rph-date',  label: '?™ì˜?¼ì' },
        { type: 'checkbox-group', id: 'rph-use',   label: '?œìš© ë²”ìœ„',
          options: ['?´ë? êµìœ¡ ?ë£Œ', 'ê¸°ê? ë³´ê³ ??, 'SNSÂ·?ë³´ ?ë£Œ', '?°êµ¬Â·?¼ë¬¸ ?ë£Œ', '?•ë? ?œì¶œ ?ë£Œ'] },
        { type: 'select',         id: 'rph-period', label: 'ë³´ìœ ê¸°ê°„',
          options: ['6ê°œì›”', '1??, '2??, '3??, '?êµ¬'] },
        { type: 'textarea', id: 'rph-memo',  label: 'ë©”ëª¨', placeholder: '?¹ì´?¬í•­???…ë ¥?˜ì„¸??' },
      ],
    },
  };

  /* ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??     2. localStorage ? í‹¸
     ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??*/
  function loadProfiles() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function saveProfiles(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
  function findProfileById(id) { return loadProfiles().find(p => p.id === id) || null; }
  function upsertProfile(profile) {
    const list = loadProfiles();
    const idx  = list.findIndex(p => p.id === profile.id);
    idx >= 0 ? list[idx] = profile : list.push(profile);
    saveProfiles(list);
  }

  /* ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??     3. ? ìŠ¤??     ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??*/
  function showSaveToast(msg = '???€?¥ë˜?ˆìŠµ?ˆë‹¤.') {
    let t = document.getElementById('profileSaveToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'profileSaveToast';
      t.className = 'profile-save-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  /* ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??     4. ë°?Room) HTML ë¹Œë”
     ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??*/
  function buildRoomField(fieldDef, roomData) {
    const val = roomData?.[fieldDef.id] || '';

    if (fieldDef.type === 'checkbox-group') {
      const savedArr = Array.isArray(roomData?.[fieldDef.id]) ? roomData[fieldDef.id] : [];
      const opts = fieldDef.options.map(opt => {
        const chk = savedArr.includes(opt) ? 'checked' : '';
        return `
          <label class="room-checkbox-item">
            <input type="checkbox" name="${fieldDef.id}" value="${opt}" ${chk}>
            <span class="room-checkbox-mark"></span>
            <span>${opt}</span>
          </label>`;
      }).join('');
      return `
        <div class="room-field-group">
          <div class="room-field-label">${fieldDef.label}</div>
          <div class="room-checkbox-group" data-field-id="${fieldDef.id}">${opts}</div>
        </div>`;
    }

    if (fieldDef.type === 'select') {
      const opts = fieldDef.options.map(o =>
        `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`
      ).join('');
      return `
        <div class="room-field-group">
          <label class="room-field-label" for="${fieldDef.id}">${fieldDef.label}</label>
          <select class="room-input" id="${fieldDef.id}" name="${fieldDef.id}">
            <option value="">? íƒ?˜ì„¸??/option>${opts}
          </select>
        </div>`;
    }

    if (fieldDef.type === 'textarea') {
      return `
        <div class="room-field-group room-field-full">
          <label class="room-field-label" for="${fieldDef.id}">${fieldDef.label}</label>
          <textarea class="room-input room-textarea" id="${fieldDef.id}" name="${fieldDef.id}"
                    placeholder="${fieldDef.placeholder || ''}" rows="3">${val}</textarea>
        </div>`;
    }

    // text / date / tel
    return `
      <div class="room-field-group">
        <label class="room-field-label" for="${fieldDef.id}">${fieldDef.label}</label>
        <input class="room-input" type="${fieldDef.type}" id="${fieldDef.id}" name="${fieldDef.id}"
               value="${val}" placeholder="${fieldDef.placeholder || ''}">
      </div>`;
  }

  function buildRoom(consentId, profile) {
    const meta     = CONSENT_META[consentId];
    const roomDef  = ROOM_FIELDS[consentId];
    if (!meta || !roomDef) return '';

    const roomData  = profile?.roomData?.[consentId] || {};
    const isAgreed  = profile?.consents?.[consentId] || false;

    const colorMap = {
      orange: 'var(--color-orange-main)',
      green:  'var(--color-green-sage)',
      yellow: '#B8860B',
      sage:   'var(--color-green-hover)',
    };
    const accentColor = colorMap[roomDef.color] || 'var(--color-orange-main)';

    const fieldsHtml = roomDef.fields.map(f => buildRoomField(f, roomData)).join('');

    return `
      <div class="consent-room" id="consentRoom" data-consent-id="${consentId}"
           style="--room-accent: ${accentColor};">

        <!-- ë°??¤ë” -->
        <div class="room-header">
          <div class="room-header-left">
            <span class="room-header-icon">${meta.icon}</span>
            <div>
              <div class="room-header-title">${meta.fullTitle} ?ë£Œ ?±ë¡</div>
              <div class="room-header-desc">${roomDef.desc}</div>
            </div>
          </div>
          <button class="room-close-btn" id="btnCloseRoom" title="ë°??«ê¸°">??/button>
        </div>

        <!-- ?™ì˜ ?¬ë? ? ê? -->
        <div class="room-agree-toggle-row">
          <span class="room-agree-label">?™ì˜ ?¬ë?</span>
          <div class="room-agree-toggle-group">
            <label class="room-toggle-btn ${isAgreed ? 'active' : ''}" id="roomToggleAgree">
              <input type="radio" name="roomConsent-${consentId}" value="true"
                     ${isAgreed ? 'checked' : ''} style="display:none;">
              ???™ì˜
            </label>
            <label class="room-toggle-btn ${!isAgreed ? 'active-no' : ''}" id="roomToggleDisagree">
              <input type="radio" name="roomConsent-${consentId}" value="false"
                     ${!isAgreed ? 'checked' : ''} style="display:none;">
              ??ë¯¸ë™??            </label>
          </div>
        </div>

        <!-- ?…ë ¥ ??ê·¸ë¦¬??-->
        <div class="room-fields-grid">
          ${fieldsHtml}
        </div>

        <!-- ?€??ë²„íŠ¼ -->
        <div class="room-footer">
          <button class="btn-room-save" id="btnSaveRoom" data-consent-id="${consentId}">
            ?’¾ ????ª© ?€??          </button>
        </div>
      </div>
    `;
  }

  /* ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??     5. ?™ì˜ ?¹ì…˜ (ì¹´ë“œ 4ì¢?+ ë°??¬ë¡¯)
     ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??*/
  function buildPrivacySection(profile) {
    const cardsHtml = CONSENT_ITEMS.map(item => {
      const isChecked = profile?.consents?.[item.id] || false;
      const meta      = CONSENT_META[item.id];
      const hasData   = !!(profile?.roomData?.[item.id] &&
                          Object.values(profile.roomData[item.id]).some(v =>
                            Array.isArray(v) ? v.length > 0 : !!v));

      return `
        <div class="consent-card ${isChecked ? 'is-checked' : ''}"
             data-consent-id="${item.id}" role="button" tabindex="0"
             aria-pressed="${isChecked}">

          <!-- ?ë‹¨: ?„ì´ì½?+ ?œëª© -->
          <div class="consent-card-header">
            <span class="consent-card-title">${meta.fullTitle}</span>
            <span class="consent-card-icon">${meta.icon}</span>
          </div>

          <!-- ?˜ë‹¨: ì²´í¬ë°•ìŠ¤ + ë°°ì? + ë°??´ê¸° ?ŒíŠ¸ -->
          <div class="consent-card-toggle-row">
            <label class="consent-toggle-label" for="${item.id}"
                   style="display:flex;align-items:center;gap:8px;cursor:pointer;"
                   onclick="event.stopPropagation()">
              <input type="checkbox" id="${item.id}" name="${item.id}"
                     ${isChecked ? 'checked' : ''}>
              <span class="consent-checkbox-box"></span>
            </label>
            <span class="consent-status-badge">${isChecked ? '?™ì˜' : 'ë¯¸ë™??}</span>
            ${hasData ? '<span class="consent-data-dot" title="?ë£Œ ?±ë¡??>??/span>' : ''}
          </div>
          <div class="consent-card-open-hint">?ë£Œ ?±ë¡ ??/div>
        </div>
      `;
    }).join('');

    return `
      <section class="privacy-record-section" id="privacyRecordSection">
        <h3 class="privacy-section-title">ê°œì¸?•ë³´ ë°?ê¸°ë¡ê´€ë¦?/h3>
        <p class="privacy-guide-text">?•ì¸???™ì˜ë§?? íƒ?´ì£¼?¸ìš”. ì¹´ë“œë¥??´ë¦­?˜ë©´ ?ë£Œë¥??±ë¡?????ˆìŠµ?ˆë‹¤.</p>

        <div class="privacy-consent-grid" id="privacyConsentGrid">
          ${cardsHtml}
        </div>

        <!-- ë°?Room) ?¬ë¡¯ ??? íƒ??ì¹´ë“œ??ë°©ì´ ?¬ê¸°???Œë”ë§?-->
        <div class="consent-room-slot" id="consentRoomSlot"></div>

        <div class="privacy-action-row">
          <button class="btn-profile-save" id="btnSaveProfile" type="button">
            ?„ë¡œ???€??          </button>
        </div>
      </section>
    `;
  }

  /* ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??     6. ë°?Room) ?¤í”ˆ & ?´ë²¤??ë°”ì¸??     ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??*/
  let _currentProfileId = null;
  let _currentProfile   = null;

  function openRoom(consentId) {
    const slot = document.getElementById('consentRoomSlot');
    if (!slot) return;

    // ?´ë? ê°™ì? ë°©ì´ ?´ë ¤ ?ˆìœ¼ë©??«ê¸° (? ê?)
    const existing = slot.querySelector('.consent-room');
    if (existing && existing.dataset.consentId === consentId) {
      closeRoom();
      return;
    }

    slot.innerHTML = buildRoom(consentId, _currentProfile);
    slot.classList.add('open');

    // ì¹´ë“œ is-open ?œì‹œ
    document.querySelectorAll('.consent-card').forEach(c => {
      c.classList.toggle('is-open', c.dataset.consentId === consentId);
    });

    bindRoomEvents(consentId, slot);

    // ë°©ìœ¼ë¡?ë¶€?œëŸ½ê²??¤í¬ë¡?    setTimeout(() => slot.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  }

  function closeRoom() {
    const slot = document.getElementById('consentRoomSlot');
    if (!slot) return;
    slot.classList.remove('open');
    slot.innerHTML = '';
    document.querySelectorAll('.consent-card').forEach(c => c.classList.remove('is-open'));
  }

  function bindRoomEvents(consentId, slot) {
    // ?«ê¸° ë²„íŠ¼
    slot.querySelector('#btnCloseRoom')?.addEventListener('click', closeRoom);

    // ?™ì˜/ë¯¸ë™???¼ë””??? ê? ??ì¹´ë“œ ë°°ì????™ê¸°??    slot.querySelectorAll(`input[name="roomConsent-${consentId}"]`).forEach(radio => {
      radio.addEventListener('change', () => {
        const agreed = radio.value === 'true';
        // ?¼ë””???¼ë²¨ ?¤í???        slot.querySelector('#roomToggleAgree')?.classList.toggle('active',    agreed);
        slot.querySelector('#roomToggleDisagree')?.classList.toggle('active-no', !agreed);
        // ì¹´ë“œ ì²´í¬ë°•ìŠ¤ + UI ?™ê¸°??        const cb = document.getElementById(consentId);
        if (cb) {
          cb.checked = agreed;
          const card = document.querySelector(`.consent-card[data-consent-id="${consentId}"]`);
          if (card) updateConsentCardUI(card, agreed);
        }
      });
    });

    // ë°??€??ë²„íŠ¼
    slot.querySelector('#btnSaveRoom')?.addEventListener('click', () => {
      saveRoomData(consentId, slot);
    });
  }

  function saveRoomData(consentId, slot) {
    if (!_currentProfileId) return;

    const profile = findProfileById(_currentProfileId) || { id: _currentProfileId };
    if (!profile.roomData)  profile.roomData  = {};
    if (!profile.consents)  profile.consents  = {};

    // ?™ì˜ ?¬ë?
    const agreeRadio = slot.querySelector(`input[name="roomConsent-${consentId}"]:checked`);
    profile.consents[consentId] = agreeRadio?.value === 'true';

    // ?…ë ¥ ?„ë“œ ?˜ì§‘
    const roomDef  = ROOM_FIELDS[consentId];
    const roomData = {};

    roomDef.fields.forEach(f => {
      if (f.type === 'checkbox-group') {
        const checked = [...slot.querySelectorAll(`input[name="${f.id}"]:checked`)]
                          .map(c => c.value);
        roomData[f.id] = checked;
      } else {
        const el = slot.querySelector(`#${f.id}`);
        if (el) roomData[f.id] = el.value;
      }
    });

    profile.roomData[consentId] = roomData;
    upsertProfile(profile);

    // ì¹´ë“œ UI ê°±ì‹ 
    _currentProfile = findProfileById(_currentProfileId);
    const card = document.querySelector(`.consent-card[data-consent-id="${consentId}"]`);
    if (card) {
      updateConsentCardUI(card, profile.consents[consentId]);
      // ?ë£Œ ?±ë¡ ???…ë°?´íŠ¸
      const hasData = Object.values(roomData).some(v => Array.isArray(v) ? v.length > 0 : !!v);
      let dot = card.querySelector('.consent-data-dot');
      if (hasData && !dot) {
        dot = document.createElement('span');
        dot.className = 'consent-data-dot';
        dot.title = '?ë£Œ ?±ë¡??;
        dot.textContent = '??;
        card.querySelector('.consent-card-toggle-row')?.appendChild(dot);
      } else if (!hasData && dot) {
        dot.remove();
      }
    }

    const meta = CONSENT_META[consentId];
    showSaveToast(`??${meta?.fullTitle || ''} ?ë£Œê°€ ?€?¥ë˜?ˆìŠµ?ˆë‹¤.`);

    if (window.VoiceManager && !window.VoiceManager.isMuted) {
      window.VoiceManager.speak(`${meta?.fullTitle || ''} ?ë£Œë¥??€?¥í–ˆ?µë‹ˆ??`);
    }
  }

  /* ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??     7. ì¹´ë“œ UI ?…ë°?´íŠ¸ ?¬í¼
     ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??*/
  function updateConsentCardUI(card, isChecked) {
    const badge = card.querySelector('.consent-status-badge');
    card.classList.toggle('is-checked', !!isChecked);
    card.setAttribute('aria-pressed', String(!!isChecked));
    if (badge) badge.textContent = isChecked ? '?™ì˜' : 'ë¯¸ë™??;
  }

  /* ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??     8. ?„ë¡œ???¸ì§‘ ?¨ë„
     ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??*/
  function buildProfileEditPanel(profile) {
    const p = profile || {};
    return `
      <div class="profile-edit-panel" id="profileEditPanel">
        <header class="profile-edit-header">
          <div class="profile-edit-title">
            <div class="profile-edit-title-icon">?‘¤</div>
            <span>${p.name ? p.name + ' ?´ë¥´???„ë¡œ?? : '???´ë¥´???„ë¡œ??}</span>
          </div>
        </header>
        <div class="profile-edit-body">
          <div class="profile-form-grid">
            <div class="profile-form-group">
              <label class="profile-form-label" for="profileName">?±í•¨</label>
              <input class="profile-form-input" type="text" id="profileName"
                     placeholder="?ê¸¸?? value="${p.name || ''}" autocomplete="name">
            </div>
            <div class="profile-form-group">
              <label class="profile-form-label" for="profileBirth">?ë…„?”ì¼</label>
              <input class="profile-form-input" type="date" id="profileBirth"
                     value="${p.birth || ''}">
            </div>
            <div class="profile-form-group">
              <label class="profile-form-label" for="profileGender">?±ë³„</label>
              <select class="profile-form-select" id="profileGender">
                <option value="" ${!p.gender ? 'selected' : ''}>? íƒ ?ˆí•¨</option>
                <option value="female" ${p.gender === 'female' ? 'selected' : ''}>?¬ì„±</option>
                <option value="male"   ${p.gender === 'male'   ? 'selected' : ''}>?¨ì„±</option>
              </select>
            </div>
            <div class="profile-form-group">
              <label class="profile-form-label" for="profileGuardian">ë³´í˜¸???°ë½ì²?/label>
              <input class="profile-form-input" type="tel" id="profileGuardian"
                     placeholder="010-0000-0000" value="${p.guardian || ''}">
            </div>
          </div>
          ${buildPrivacySection(p)}
        </div>
      </div>
    `;
  }

  /* ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??     9. ?¸ì§‘ ?¹ì…˜ ?Œë”ë§?+ ?´ë²¤??ë°”ì¸??     ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??*/
  function renderEditSection(profileId, profile) {
    _currentProfileId = profileId;
    _currentProfile   = profile;

    const editArea = document.getElementById('userProfileEditArea');
    if (!editArea) return;
    editArea.innerHTML = buildProfileEditPanel(profile);

    // ?€?€ ?™ì˜ ì¹´ë“œ ?´ë²¤???€?€
    const grid = document.getElementById('privacyConsentGrid');
    if (grid) {
      grid.querySelectorAll('.consent-card').forEach(card => {
        const consentId = card.dataset.consentId;

        // ì¹´ë“œ ?„ì²´ ?´ë¦­ ??ë°??´ê¸°
        card.addEventListener('click', (e) => {
          // ì²´í¬ë°•ìŠ¤ label ?´ë¦­?€ ë°??´ê¸°?ì„œ ?œì™¸
          if (e.target.closest('.consent-toggle-label')) return;
          openRoom(consentId);
        });

        // ì²´í¬ë°•ìŠ¤ ì§ì ‘ ë³€ê²???ì¹´ë“œ UIë§?ê°±ì‹ 
        const cb = document.getElementById(consentId);
        if (cb) {
          cb.addEventListener('change', () => updateConsentCardUI(card, cb.checked));
        }
      });
    }

    // ?€?€ ?„ë¡œ???€??ë²„íŠ¼ ?€?€
    document.getElementById('btnSaveProfile')?.addEventListener('click', () => {
      handleSaveProfile(profileId);
    });
  }

  /* ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??     10. ?„ë¡œ???„ì²´ ?€??(ê¸°ë³¸?•ë³´ + ?™ì˜ ì²´í¬)
     ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??*/
  function handleSaveProfile(profileId) {
    const existing = findProfileById(profileId) || { id: profileId };

    existing.name     = document.getElementById('profileName')?.value.trim()    || '';
    existing.birth    = document.getElementById('profileBirth')?.value           || '';
    existing.gender   = document.getElementById('profileGender')?.value          || '';
    existing.guardian = document.getElementById('profileGuardian')?.value.trim() || '';
    existing.updatedAt = new Date().toISOString();

    // ?™ì˜ ì²´í¬ë°•ìŠ¤ ?˜ì§‘
    if (!existing.consents) existing.consents = {};
    CONSENT_ITEMS.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) existing.consents[item.id] = el.checked;
    });

    upsertProfile(existing);
    _currentProfile = existing;

    const listArea = document.getElementById('userProfileListArea');
    if (listArea) renderUsersList(listArea, profileId);

    if (window.VoiceManager && !window.VoiceManager.isMuted) {
      window.VoiceManager.speak(`${existing.name || '?´ë¥´??} ?„ë¡œ?„ì„ ?€?¥í–ˆ?µë‹ˆ??`);
    }
    showSaveToast(`??${existing.name || '?´ë¥´??} ?„ë¡œ?„ì´ ?€?¥ë˜?ˆìŠµ?ˆë‹¤.`);
  }

  /* ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??     11. ?´ë¥´??ëª©ë¡ ?Œë”ë§?     ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??*/
  function renderUsersList(container, selectedId) {
    const profiles = loadProfiles();
    let html = `<div class="users-grid">`;

    profiles.forEach(p => {
      const isSel = p.id === selectedId;
      html += `
        <div class="user-card ${isSel ? 'selected' : ''}" data-user-id="${p.id}"
             role="button" tabindex="0">
          <div class="user-card-name">?‘¤ ${p.name || '?´ë¦„ ?†ìŒ'}</div>
          <div class="user-card-meta">
            ${p.birth || '?ë…„?”ì¼ ë¯¸ì…??} Â·
            ${p.gender === 'female' ? '?¬ì„±' : p.gender === 'male' ? '?¨ì„±' : '-'}
          </div>
        </div>`;
    });

    html += `
      <div class="user-card user-card-add" id="btnAddNewUser" role="button" tabindex="0">
        <span class="user-card-add-icon">??/span>
        <span>???´ë¥´??ì¶”ê?</span>
      </div>
    </div>`;

    container.innerHTML = html;

    container.querySelectorAll('.user-card[data-user-id]').forEach(card => {
      card.addEventListener('click', () => {
        const uid     = card.dataset.userId;
        const profile = findProfileById(uid);
        renderEditSection(uid, profile);
        renderUsersList(container, uid);
      });
    });

    container.querySelector('#btnAddNewUser')?.addEventListener('click', () => {
      const newId = 'user_' + Date.now();
      renderEditSection(newId, null);
      renderUsersList(container, newId);
    });
  }

  /* ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??     12. ì§„ì…??& ê¸€ë¡œë²Œ ?±ë¡
     ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•??*/
  function initUsersTab(containerEl) {
    containerEl.innerHTML = `
      <div class="users-tab-container">
        <div id="userProfileListArea"></div>
        <div id="userProfileEditArea"></div>
      </div>`;
    const listArea = document.getElementById('userProfileListArea');
    if (listArea) renderUsersList(listArea, null);
  }

  window.UserProfileManager = { initUsersTab, loadProfiles, findProfileById, showSaveToast };

})();




  /* ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
     1. ?ìˆ˜ / ê¸°ë³¸ ?°ì´??     ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€ */
  const STORAGE_KEY = 'digitalSchool_userProfiles';

  /** ?™ì˜ ??ª© ?•ì˜ */
  const CONSENT_ITEMS = [
    { id: 'consent-personal',   label: 'ê°œì¸?•ë³´ ?™ì˜' },
    { id: 'consent-guardian',   label: 'ë³´í˜¸???™ì˜' },
    { id: 'consent-program',    label: '?„ë¡œê·¸ë¨ ì°¸ì—¬ ?™ì˜' },
    { id: 'consent-photo',      label: '?¬ì§„ ?œìš© ?™ì˜' },
  ];

  /* ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
     2. localStorage ? í‹¸
     ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€ */
  function loadProfiles() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveProfiles(profiles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }
