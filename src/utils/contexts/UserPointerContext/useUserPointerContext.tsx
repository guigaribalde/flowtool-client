import { useContext } from 'react';
import {
	UserPointerContext,
	type UserPointerContextState,
} from './UserPointerContext';

export default function useUserPointerContext(): UserPointerContextState {
	const { pointers, setPointers } = useContext(UserPointerContext);
	return { pointers, setPointers };
}
