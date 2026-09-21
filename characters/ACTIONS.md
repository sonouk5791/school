# 캐릭터 동작 분류 및 사용

외형 기준은 계속 `reference/official-mouth-sheet.png`입니다. 동작 시트는 `reference/actions/source.png`이며, 제목의 “10개”와 달리 실제로는 4행 × 9칸 = 36칸입니다.

## 분류 결과

- 공식 동물·의상 조합에 맞는 27칸: 콩이 6, 토리 9, 나비 6, 보리 6.
- 다른 동물/잘못된 의상 9칸: pose-only로 격리, 웹 캐릭터 데이터에 등록하지 않음.
- 콩이: 1행 1·2·3·7·9열, 2행 2열.
- 토리: 1행 4·5·6열, 2행 1·4·5·7·8열, 3행 8열.
- 나비: 3행 1·2·3·5·6·9열.
- 보리: 4행 1·2·4·7·8·9열.
- 격리: 1행 8열 / 2행 3·6·9열 / 3행 4·7열 / 4행 3·5·6열.

`reference/actions/classification.json`에 각 원본 좌표, 판단 이유, 동작, 채택 여부를 기록했습니다. 정지 이미지의 동작 이름은 보이는 자세를 바탕으로 해석한 것이며, 예를 들어 turn은 뒤돌아 선 자세입니다. 잘못된 한글 라벨은 사용하지 않았습니다.

## 파일 및 재사용

- 캐릭터별 `actions/` 폴더에 PNG. 중복 자세는 cheer_2, music_2처럼 보존.
- idle은 기존 공식 입모양 시트의 기본 이미지 그대로 사용.
- 모든 파일 128×144 RGBA, 원본의 낮은 해상도(캐릭터 약 40~60px 높이)로 확대 시 흐림. 재생성/외형 변경 없음.
- `actions-manifest.json` 및 `manifest.json`의 actions에 실제 존재하는 동작만 등록.
- `actions-preview.html`에서 모든 등록 동작을 클릭해 확인 가능.

```js
const result = CharacterActions.show(imageElement, 'kongi', 'read', { duration: 3000 });
// 없는 동작은 같은 캐릭터의 idle로 복귀하고 result.available === false.
CharacterActions.resolve('tori', 'dance');
CharacterActions.categories;
// CustomEvent('character:action', {detail:{target:'#character',id:'bori',action:'music'}})
```

기존 수업 시작/설명/완료/정답/마무리 메서드를 보존한 채 동작 호출을 추가했습니다. 음성이 나올 때는 검증된 정면 입모양 프레임을 우선하며, 음성 종료 후 남겨둔 동작으로 돌아갑니다. 동작 유지 타이머는 발화 중 보류합니다. 화면 이탈 시 타이머 정리.

exercise, point 등 시트에 일치하는 그림이 없는 동작은 만들거나 다른 동물로 대체하지 않습니다. pose-only의 자세를 공식 캐릭터로 다시 그리는 작업도 하지 않았습니다. 기존 UI/수업 로직은 유지합니다.
