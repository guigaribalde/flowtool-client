import { useContext } from 'react';
import { BoardContextState, BoardContext } from '../context/BoardContext';

export default function useBoard() {
	const query: BoardContextState = useContext(BoardContext);
	return query;
}
