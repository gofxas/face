import * as faceShape from './face_shape.js';
import * as eyeShape from './eye_shape.js';
import * as hairLines from './hair_lines.js';
import * as mouthShape from './mouth_shape.js';

function randomFromInterval(min, max) {
	// min and max included
	return Math.random() * (max - min) + min;
}

const state = {
	faceScale: 1.8, // face scale
	computedFacePoints: [], // the polygon points for face countour
	eyeRightUpper: [], // the points for right eye upper lid
	eyeRightLower: [],
	eyeRightCountour: [], // for the white part of the eye
	eyeLeftUpper: [],
	eyeLeftLower: [],
	eyeLeftCountour: [],
	faceHeight: 0, // the height of the face
	faceWidth: 0, // the width of the face
	center: [0, 0], // the center of the face
	distanceBetweenEyes: 0, // the distance between the eyes
	leftEyeOffsetX: 0, // the offset of the left eye
	leftEyeOffsetY: 0, // the offset of the left eye
	rightEyeOffsetX: 0, // the offset of the right eye
	rightEyeOffsetY: 0, // the offset of the right eye
	eyeHeightOffset: 0, // the offset of the eye height
	leftEyeCenter: [0, 0], // the center of the left eye
	rightEyeCenter: [0, 0], // the center of the right eye
	rightPupilShiftX: 0, // the shift of the right pupil
	rightPupilShiftY: 0, // the shift of the right pupil
	leftPupilShiftX: 0, // the shift of the left pupil
	leftPupilShiftY: 0, // the shift of the left pupil
	rightNoseCenterX: 0, // the center of the right nose
	rightNoseCenterY: 0, // the center of the right nose
	leftNoseCenterX: 0, // the center of the left nose
	leftNoseCenterY: 0, // the center of the left nose
	hairs: [],
	hairColors: [
		'rgb(0, 0, 0)', // Black
		'rgb(44, 34, 43)', // Dark Brown
		'rgb(80, 68, 68)', // Medium Brown
		'rgb(167, 133, 106)', // Light Brown
		'rgb(220, 208, 186)', // Blond
		'rgb(233, 236, 239)', // Platinum Blond
		'rgb(165, 42, 42)', // Red
		'rgb(145, 85, 61)', // Auburn
		'rgb(128, 128, 128)', // Grey
		'rgb(185, 55, 55)', // fire
		'rgb(255, 192, 203)', // Pastel Pink
		'rgb(255, 105, 180)', // Bright Pink
		'rgb(230, 230, 250)', // Lavender
		'rgb(64, 224, 208)', // Turquoise
		'rgb(0, 191, 255)', // Bright Blue
		'rgb(148, 0, 211)', // Deep Purple
		'rgb(50, 205, 50)', // Lime Green
		'rgb(255, 165, 0)', // Vivid Orange
		'rgb(220, 20, 60)', // Crimson Red
		'rgb(192, 192, 192)', // Silver
	],
	hairColor: 'black',
	dyeColorOffset: '50%',
	backgroundColors: [
		'rgb(245, 245, 220)', // Soft Beige
		'rgb(176, 224, 230)', // Pale Blue
		'rgb(211, 211, 211)', // Light Grey
		'rgb(152, 251, 152)', // Pastel Green
		'rgb(255, 253, 208)', // Cream
		'rgb(230, 230, 250)', // Muted Lavender
		'rgb(188, 143, 143)', // Dusty Rose
		'rgb(135, 206, 235)', // Sky Blue
		'rgb(245, 255, 250)', // Mint Cream
		'rgb(245, 222, 179)', // Wheat
		'rgb(47, 79, 79)', // Dark Slate Gray
		'rgb(72, 61, 139)', // Dark Slate Blue
		'rgb(60, 20, 20)', // Dark Brown
		'rgb(25, 25, 112)', // Midnight Blue
		'rgb(139, 0, 0)', // Dark Red
		'rgb(85, 107, 47)', // Olive Drab
		'rgb(128, 0, 128)', // Purple
		'rgb(0, 100, 0)', // Dark Green
		'rgb(0, 0, 139)', // Dark Blue
		'rgb(105, 105, 105)', // Dim Gray
	],
	mouthPoints: [],
};
const Arr = (length) => new Array(length).fill(0);
const generateFace = () => {
	let faceResults = faceShape.generateFaceCountourPoints();
	state.computedFacePoints = faceResults.face;
	state.faceHeight = faceResults.height;
	state.faceWidth = faceResults.width;
	state.center = faceResults.center;
	let eyes = eyeShape.generateBothEyes(state.faceWidth / 2);
	let left = eyes.left;
	let right = eyes.right;
	state.eyeRightUpper = right.upper;
	state.eyeRightLower = right.lower;
	state.eyeRightCountour = right.upper.slice(10, 90).concat(right.lower.slice(10, 90).reverse());
	state.eyeLeftUpper = left.upper;
	state.eyeLeftLower = left.lower;
	state.eyeLeftCountour = left.upper.slice(10, 90).concat(left.lower.slice(10, 90).reverse());
	state.distanceBetweenEyes = randomFromInterval(state.faceWidth / 4.5, state.faceWidth / 4);
	state.eyeHeightOffset = randomFromInterval(state.faceHeight / 8, state.faceHeight / 6);
	state.leftEyeOffsetX = randomFromInterval(-state.faceWidth / 20, state.faceWidth / 10);
	state.leftEyeOffsetY = randomFromInterval(-state.faceHeight / 50, state.faceHeight / 50);
	state.rightEyeOffsetX = randomFromInterval(-state.faceWidth / 20, state.faceWidth / 10);
	state.rightEyeOffsetY = randomFromInterval(-state.faceHeight / 50, state.faceHeight / 50);
	state.leftEyeCenter = left.center[0];
	state.rightEyeCenter = right.center[0];
	state.leftPupilShiftX = randomFromInterval(-state.faceWidth / 20, state.faceWidth / 20);

	// now we generate the pupil shifts
	// we first pick a point from the upper eye lid
	let leftInd0 = Math.floor(randomFromInterval(10, left.upper.length - 10));
	let rightInd0 = Math.floor(randomFromInterval(10, right.upper.length - 10));
	let leftInd1 = Math.floor(randomFromInterval(10, left.upper.length - 10));
	let rightInd1 = Math.floor(randomFromInterval(10, right.upper.length - 10));
	let leftLerp = randomFromInterval(0.2, 0.8);
	let rightLerp = randomFromInterval(0.2, 0.8);

	state.leftPupilShiftY = left.upper[leftInd0][1] * leftLerp + left.lower[leftInd1][1] * (1 - leftLerp);
	state.rightPupilShiftY = right.upper[rightInd0][1] * rightLerp + right.lower[rightInd1][1] * (1 - rightLerp);
	state.leftPupilShiftX = left.upper[leftInd0][0] * leftLerp + left.lower[leftInd1][0] * (1 - leftLerp);
	state.rightPupilShiftX = right.upper[rightInd0][0] * rightLerp + right.lower[rightInd1][0] * (1 - rightLerp);

	var numHairLines = [];
	var numHairMethods = 4;
	for (var i = 0; i < numHairMethods; i++) {
		numHairLines.push(Math.floor(randomFromInterval(0, 50)));
	}
	state.hairs = [];
	if (Math.random() > 0.3) {
		state.hairs = hairLines.generateHairLines0(state.computedFacePoints, numHairLines[0] * 1 + 10);
	}
	if (Math.random() > 0.3) {
		state.hairs = state.hairs.concat(hairLines.generateHairLines1(state.computedFacePoints, numHairLines[1] / 1.5 + 10));
	}
	if (Math.random() > 0.5) {
		state.hairs = state.hairs.concat(hairLines.generateHairLines2(state.computedFacePoints, numHairLines[2] * 3 + 10));
	}
	if (Math.random() > 0.5) {
		state.hairs = state.hairs.concat(hairLines.generateHairLines3(state.computedFacePoints, numHairLines[3] * 3 + 10));
	}
	state.rightNoseCenterX = randomFromInterval(state.faceWidth / 18, state.faceWidth / 12);
	state.rightNoseCenterY = randomFromInterval(0, state.faceHeight / 5);
	state.leftNoseCenterX = randomFromInterval(-state.faceWidth / 18, -state.faceWidth / 12);
	state.leftNoseCenterY = state.rightNoseCenterY + randomFromInterval(-state.faceHeight / 30, state.faceHeight / 20);
	if (Math.random() > 0.1) {
		// use natural hair color
		state.hairColor = state.hairColors[Math.floor(Math.random() * 10)];
	} else {
		state.hairColor = 'url(#rainbowGradient)';
		state.dyeColorOffset = randomFromInterval(0, 100) + '%';
	}

	var choice = Math.floor(Math.random() * 3);
	if (choice == 0) {
		state.mouthPoints = mouthShape.generateMouthShape0(state.computedFacePoints, state.faceHeight, state.faceWidth);
	} else if (choice == 1) {
		state.mouthPoints = mouthShape.generateMouthShape1(state.computedFacePoints, state.faceHeight, state.faceWidth);
	} else {
		state.mouthPoints = mouthShape.generateMouthShape2(state.computedFacePoints, state.faceHeight, state.faceWidth);
	}
};
export const Render = () => {
  generateFace();
	return `<svg
    viewBox="-100 -100 200 200"
    xmlns="http://www.w3.org/2000/svg"
    width="800"
    height="800"
    id="face-svg"
    >
    <defs>
      <clipPath id="leftEyeClipPath">
        <polyline points="${state.eyeLeftCountour}" />
      </clipPath>
      <clipPath id="rightEyeClipPath">
        <polyline points="${state.eyeRightCountour}" />
      </clipPath>
    
      <filter id="fuzzy">
        <feTurbulence
          id="turbulence"
          baseFrequency="0.05"
          numOctaves="3"
          type="noise"
          result="noise"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
      <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop
          offset="0%"
          style="
            ${'stop-color: ' + state.hairColors[Math.floor(Math.random() * 10)] + ';  stop-opacity: 1'}
          "
        />
        <stop
          offset="${state.dyeColorOffset}"
          style="
            ${'stop-color: ' + state.hairColors[Math.floor(Math.random() * state.hairColors.length)] + ';  stop-opacity: 1'}
          "
        />
        <stop
          offset="100%"
          style="
            ${'stop-color: ' + state.hairColors[Math.floor(Math.random() * state.hairColors.length)] + ';  stop-opacity: 1'}
          "
        />
      </linearGradient>
    </defs>
    <rect
      x="-100"
      y="-100"
      width="100%"
      height="100%"
      fill="
        ${state.backgroundColors[Math.floor(Math.random() * state.backgroundColors.length)]}
      "
    />
    <polyline
      id="faceContour"
      points="${state.computedFacePoints}"
      fill="#ffc9a9"
      stroke="black"
      stroke-width="${3.0 / state.faceScale}"
      stroke-linejoin="round"
      filter="url(#fuzzy)"
    />
    
    <g
      transform="
        ${
					'translate(' +
					(state.center[0] + state.distanceBetweenEyes + state.rightEyeOffsetX) +
					' ' +
					-(-state.center[1] + state.eyeHeightOffset + state.rightEyeOffsetY) +
					')'
				}  
      "
    >
      <polyline
        id="rightCountour"
        points="${state.eyeRightCountour}"
        fill="white"
        stroke="white"
        stroke-width="${0.0 / state.faceScale}"
        stroke-linejoin="round"
        filter="url(#fuzzy)"
      />
    </g>
    <g
      transform="
        ${
					'translate(' +
					-(state.center[0] + state.distanceBetweenEyes + state.leftEyeOffsetX) +
					' ' +
					-(-state.center[1] + state.eyeHeightOffset + state.leftEyeOffsetY) +
					')'
				}
      "
    >
      <polyline
        id="leftCountour"
        points="${state.eyeLeftCountour}"
        fill="white"
        stroke="white"
        stroke-width="${0.0 / state.faceScale}"
        stroke-linejoin="round"
        filter="url(#fuzzy)"
      />
    </g>
    <g
      transform="
        ${
					'translate(' +
					(state.center[0] + state.distanceBetweenEyes + state.rightEyeOffsetX) +
					' ' +
					-(-state.center[1] + state.eyeHeightOffset + state.rightEyeOffsetY) +
					')'
				}
      "
    >
      <polyline
        id="rightUpper"
        points="${state.eyeRightUpper}"
        fill="none"
        stroke="black"
        stroke-width="${3.0 / state.faceScale}"
        stroke-linejoin="round"
        filter="url(#fuzzy)"
      />
      <polyline
        id="rightLower"
        points="${state.eyeRightLower}"
        fill="none"
        stroke="black"
        stroke-width="${4.0 / state.faceScale}"
        stroke-linejoin="round"
        filter="url(#fuzzy)"
      />
      ${Arr(10).map(
				() => `<circle
        r="${Math.random() * 2 + 3.0}"
        cx="${state.rightPupilShiftX + Math.random() * 5 - 2.5}"
        cy="${state.rightPupilShiftY + Math.random() * 5 - 2.5}"
        stroke="black"
        fill="none"
        stroke-width="1.0"
        filter="url(#fuzzy)"
        clip-path="url(#rightEyeClipPath)"
      />`
			)}
    </g>
    <g
      transform="
        ${
					'translate(' +
					-(state.center[0] + state.distanceBetweenEyes + state.leftEyeOffsetX) +
					' ' +
					-(-state.center[1] + state.eyeHeightOffset + state.leftEyeOffsetY) +
					')'
				}
      "
    >
      <polyline
        id="leftUpper"
        points="${state.eyeLeftUpper}"
        fill="none"
        stroke="black"
        stroke-width="${4.0 / state.faceScale}"
        stroke-linejoin="round"
        filter="url(#fuzzy)"
      />
      <polyline
        id="leftLower"
        points="${state.eyeLeftLower}"
        fill="none"
        stroke="black"
        stroke-width="${4.0 / state.faceScale}"
        stroke-linejoin="round"
        filter="url(#fuzzy)"
      />
      ${Arr(10).map(
				() => `<circle
        r="${Math.random() * 2 + 3.0}"
        cx="${state.leftPupilShiftX + Math.random() * 5 - 2.5}"
        cy="${state.leftPupilShiftY + Math.random() * 5 - 2.5}"
        stroke="black"
        fill="none"
        stroke-width="1.0"
        filter="url(#fuzzy)"
        clip-path="url(#leftEyeClipPath)"
      />`
			)}
      
    
    </g>
    <g id="hairs">
      ${state.hairs.map(
				(hair) => `<polyline
        points="${hair}"
        fill="none"
        stroke="${state.hairColor}"
        stroke-width="2"
        stroke-linejoin="round"
        filter="url(#fuzzy)"
      />`
			)}
    </g>
    ${
			Math.random() > 0.5
				? `<g id="pointNose" >
        <g id="rightNose">
          ${Arr(10).map(
						(_) => `<circle
              r="${Math.random() * 2 + 1.0}"
              cx="${state.rightNoseCenterX + Math.random() * 4 - 2}"
              cy="${state.rightNoseCenterY + Math.random() * 4 - 2}"
              stroke="black"
              fill="none"
              stroke-width="1.0"
              filter="url(#fuzzy)"
            />`
					)}
        </g>
        <g id="leftNose">
          ${Arr(10).map(
						(_) => `<circle
              r="${Math.random() * 2 + 1.0}"
              cx="${state.leftNoseCenterX + Math.random() * 4 - 2}"
              cy="${state.leftNoseCenterY + Math.random() * 4 - 2}"
              stroke="black"
              fill="none"
              stroke-width="1.0"
              filter="url(#fuzzy)"
            />`
					)}
        </g>
      </g>`
				: `
      <g id="lineNose" >
        <path
          d="
           ${
							'M ' +
							state.leftNoseCenterX +
							' ' +
							state.leftNoseCenterY +
							', Q' +
							state.rightNoseCenterX +
							' ' +
							state.rightNoseCenterY * 1.5 +
							',' +
							(state.leftNoseCenterX + state.rightNoseCenterX) / 2 +
							' ' +
							-state.eyeHeightOffset * 0.2
						}
          "
          fill="none"
          stroke="black"
          stroke-width="3"
          stroke-linejoin="round"
          filter="url(#fuzzy)"
        ></path>
      </g>`
		}
    <g id="mouth">
      <polyline
        points="${state.mouthPoints}"
        fill="rgb(215,127,140)"
        stroke="black"
        stroke-width="3"
        stroke-linejoin="round"
        filter="url(#fuzzy)"
      />
    </g>
    </svg>`;
};
