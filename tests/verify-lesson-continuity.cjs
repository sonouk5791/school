const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock browser window and load LESSON_CATALOG
global.window = global;
require('../js/lesson-data.js');

const catalog = window.LESSON_CATALOG;
assert(Array.isArray(catalog), 'LESSON_CATALOG must be an array');
console.log(`Total lessons in LESSON_CATALOG: ${catalog.length}`);

// The 8 senior lessons
const seniorIds = ['greeting', 'photo', 'music', 'art', 'memory', 'smartphone', 'ask', 'story'];

seniorIds.forEach(id => {
  const lesson = catalog.find(l => l.id === id);
  assert(lesson, `Lesson "${id}" must exist`);
  console.log(`\nVerifying Lesson: ${lesson.title} (${lesson.id}) - ${lesson.steps.length} steps`);
  
  assert.equal(lesson.steps.length, 8, `Lesson "${id}" must have exactly 8 coherent steps`);

  lesson.steps.forEach((step, idx) => {
    const expectedStepNum = idx + 1;
    assert.equal(step.stepNum, expectedStepNum, `Step number mismatch in ${id}, index ${idx}`);
    
    // Check text fields
    assert(step.aiMessage && step.aiMessage.length > 5, `Step ${expectedStepNum} must have descriptive aiMessage`);
    assert(step.screenText && step.screenText.length > 5, `Step ${expectedStepNum} must have screenText`);
    assert(step.voiceScript && step.voiceScript.length > 5, `Step ${expectedStepNum} must have voiceScript`);
    assert(step.prompt && step.prompt.length > 5, `Step ${expectedStepNum} must have prompt`);
    assert(step.imageCaption && step.imageCaption.length > 5, `Step ${expectedStepNum} must have imageCaption`);

    // Verify image file exists
    assert(step.imageSrc, `Step ${expectedStepNum} in ${id} must have imageSrc`);
    const imgPath = path.resolve(__dirname, '..', step.imageSrc);
    assert(fs.existsSync(imgPath), `Image does not exist: ${step.imageSrc}`);

    // Verify options
    assert(Array.isArray(step.options) && step.options.length >= 2, `Step ${expectedStepNum} must have at least 2 options`);
    step.options.forEach(opt => {
      assert(opt.text && opt.text.length > 0, `Option in step ${expectedStepNum} must have text`);
      assert(opt.feedback && opt.feedback.length > 0, `Option in step ${expectedStepNum} must have feedback`);
    });
    
    console.log(`  Step ${expectedStepNum}: [${step.imageCaption}] -> Img: ${step.imageSrc.split('/').pop()}`);
  });
});

console.log('\n--- Narrative Continuity Checks ---');

// Specific check for 'story' (의좋은 형제)
const story = catalog.find(l => l.id === 'story');
assert.equal(story.steps[0].imageSrc, 'assets/images/story-brothers-daytime-introduction.png', 'Story step 1 should show brothers daytime');
assert.equal(story.steps[1].imageSrc, 'assets/images/story_village_brothers.jpg', 'Story step 2 should show village');
assert.equal(story.steps[2].imageSrc, 'assets/images/story_brothers_harvest.jpg', 'Story step 3 should show harvest sheaves');
assert.equal(story.steps[3].imageSrc, 'assets/images/story_brothers_dinner.jpg', 'Story step 4 should show courtyard mealtime');
assert.equal(story.steps[4].imageSrc, 'assets/images/story-brother-bedroom-thought.png', 'Story step 5 should show courtyard at night');
assert.equal(story.steps[5].imageSrc, 'assets/images/story-brother-morning-rice.png', 'Story step 6 should show morning sheaves');
assert.equal(story.steps[6].imageSrc, 'assets/images/story-brothers-moonlight-hug.png', 'Story step 7 should show mountain pass embrace');
assert.equal(story.steps[7].imageSrc, 'assets/images/ai_puppy_heart.jpg', 'Story step 8 should show happy ending');
console.log('✅ "이야기 만들기" (의좋은 형제) narrative arc verified!');

// Specific check for 'photo' (고향의 하루)
const photo = catalog.find(l => l.id === 'photo');
assert.equal(photo.steps[0].imageSrc, 'assets/images/nostalgic_village.jpg', 'Photo step 1 morning courtyard');
assert.equal(photo.steps[1].imageSrc, 'assets/images/story_courtyard_sunflower.jpg', 'Photo step 2 courtyard sunflower');
assert.equal(photo.steps[2].imageSrc, 'assets/images/story_courtyard_mealtime.jpg', 'Photo step 3 room & meal');
assert.equal(photo.steps[3].imageSrc, 'assets/images/korean_stew_table.jpg', 'Photo step 4 stew table');
assert.equal(photo.steps[4].imageSrc, 'assets/images/warm_jujube_tea.jpg', 'Photo step 5 porch jujube tea');
assert.equal(photo.steps[5].imageSrc, 'assets/images/ai_puppy_friend.jpg', 'Photo step 6 porch puppy');
assert.equal(photo.steps[6].imageSrc, 'assets/images/nostalgic_village_sunset.jpg', 'Photo step 7 sunset village');
assert.equal(photo.steps[7].imageSrc, 'assets/images/story_hometown_album.jpg', 'Photo step 8 memory completion');
console.log('✅ "추억의 사진 이야기" (고향의 하루) narrative arc verified!');

// Check AI lessons still intact
const expectedAiLessons = ['ai_basic', 'prompt_basic', 'ai_writing', 'ai_image', 'ai_video', 'ai_music', 'ai_life', 'ai_quiz'];
expectedAiLessons.forEach(id => {
  const found = catalog.find(l => l.id === id);
  assert(found, `AI lesson "${id}" must remain intact`);
});
console.log('✅ All AI curriculum lessons intact!');

console.log('\n--- ALL LESSON CONTINUITY TESTS PASSED 100%! ---');
