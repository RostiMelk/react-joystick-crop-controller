import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Joystick from './components/Joystick';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 600px;
	margin: 0 auto;
	padding: 1rem;
	gap: 2rem;
`;

const Box = styled.div`
	position: relative;
	width: 100%;
	aspect-ratio: 16/10;
	background-color: #5b5fff;
	border-radius: 6px;
`;

const CropBox = styled.div<{ position: { x: number; y: number }; zoom: number }>`
	display: flex;
	position: absolute;
	top: ${({ position }) => position.y * 100}%;
	left: ${({ position }) => position.x * 100}%;
	justify-content: center;
	align-items: center;
	width: 100%;
	border-radius: 3px;
	color: #3032a6;
	font-size: 3rem;
	pointer-events: none;
	background-color: #a6b9ff;
	transform: ${({ zoom }) => `scale(${zoom})`};
	transform-origin: 0 0;
	aspect-ratio: 16/10;
	transition: all 0.2s linear;
`;

function App() {
	const zoom = 0.4;
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const handleDirectionChange = (direction: string | null) => {
		const minX = 0;
		const maxX = 1 - zoom;
		const minY = 0;
		const maxY = 1 - zoom;

		switch (direction) {
			case 'up':
				setPosition((prev) => ({
					x: prev.x,
					y: Math.max(prev.y - 0.02, minY),
				}));
				break;
			case 'right':
				setPosition((prev) => ({
					x: Math.min(prev.x + 0.02, maxX),
					y: prev.y,
				}));
				break;
			case 'down':
				setPosition((prev) => ({
					x: prev.x,
					y: Math.min(prev.y + 0.02, maxY),
				}));
				break;
			case 'left':
				setPosition((prev) => ({
					x: Math.max(prev.x - 0.02, minX),
					y: prev.y,
				}));
				break;
		}
	};

	return (
		<Container>
			<h4>Position: {JSON.stringify(position)}</h4>
			<Box>
				<CropBox position={position} zoom={zoom}>
					Crop Zone
				</CropBox>
			</Box>
			<Joystick onDirection={handleDirectionChange} />
		</Container>
	);
}

export default App;
