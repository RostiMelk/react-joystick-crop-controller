import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronUp, ChevronRight, ChevronDown, ChevronLeft } from '@huddly/frokost/havre';

type direction = null | 'up' | 'right' | 'down' | 'left';

const Wrapper = styled.div`
	display: grid;
	position: relative;
	flex-shrink: 0;
	width: 10rem;
	height: 10rem;
	border-radius: 50%;
	overflow: hidden;
	background-color: #5b5fff;
	transform: rotate(45deg);
	grid-template-columns: repeat(2, 1fr);
`;

const Button = styled.button<{ isActive: boolean }>`
	border: 0;
	color: #fff;
	cursor: pointer;
	background-color: ${({ isActive }) => (isActive ? '#393CBD' : 'inherit')};

	// apply hover when not active
	${({ isActive }) =>
		!isActive &&
		`&:hover,
		&:focus-visible {
			background-color: #4b4fe3;
		}`}

	svg {
		pointer-events: none;
		transform: rotate(-45deg);
	}
`;

const Thumb = styled.div<{ direction: direction }>`
	position: absolute;
	top: 50%;
	left: 50%;
	width: 4rem;
	height: 4rem;
	border-radius: 50%;
	pointer-events: none;
	background-color: #fff;
	transition: transform 0.2s ease-in-out;
	transform: translate(-50%, -50%);
	transform: ${({ direction }) =>
		direction === 'up'
			? 'translate(calc(-50% - 0.5rem), calc(-50% - 0.5rem))'
			: direction === 'right'
			? 'translate(calc(-50% + 0.5rem), calc(-50% - 0.5rem))'
			: direction === 'left'
			? 'translate(calc(-50% - 0.5rem), calc(-50% + 0.5rem))'
			: direction === 'down'
			? 'translate(calc(-50% + 0.5rem), calc(-50% + 0.5rem))'
			: 'translate(-50%, -50%)'};
`;

interface Props {
	onDirection: (direction: direction) => void;
}

const Joystick = ({ onDirection }: Props) => {
	const joystickRef = useRef<HTMLDivElement>(null);
	const [direction, setDirection] = useState<direction>(null);

	useEffect(() => {
		const joystick = joystickRef.current as HTMLDivElement;
		if (!joystick) return;

		let mouseDown = false;
		let intervalId = 0;
		let prevValue = direction;

		const handleSubmitDirectionChange = (value: direction) => {
			intervalId && window.clearInterval(intervalId);
			intervalId = window.setInterval(() => {
				onDirection && onDirection(value);
			}, 100);
		};

		const handleMouseDown = (e: MouseEvent) => {
			const value = (e.target as HTMLButtonElement).value as direction;
			if (value) {
				setDirection(value as direction);
				mouseDown = true;
				handleSubmitDirectionChange(value);
			}
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (!mouseDown) return;
			const value = (e.target as HTMLButtonElement).value as direction;
			if (value) {
				if (prevValue === value) return;
				prevValue = value;
				setDirection(value as direction);
				handleSubmitDirectionChange(value);
			}
		};

		const handleMouseUp = () => {
			if (!mouseDown) return;
			setDirection(null);
			mouseDown = false;
			window.clearInterval(intervalId);
		};

		joystick.addEventListener('mousedown', handleMouseDown);
		joystick.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			joystick.removeEventListener('mousedown', handleMouseDown);
			joystick.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);

	return (
		<Wrapper ref={joystickRef}>
			<Button value="up" isActive={direction === 'up'}>
				<ChevronUp color="white" />
			</Button>
			<Button value="right" isActive={direction === 'right'}>
				<ChevronRight color="white" />
			</Button>
			<Button value="left" isActive={direction === 'left'}>
				<ChevronLeft color="white" />
			</Button>
			<Button value="down" isActive={direction === 'down'}>
				<ChevronDown color="white" />
			</Button>

			<Thumb direction={direction} />
		</Wrapper>
	);
};

export default Joystick;
