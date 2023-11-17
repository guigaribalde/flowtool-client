import { useContext } from 'react';
import { CurrentUserContext } from '../context/CurrentUserContext';

export default function useCurrentUser() {
	return useContext(CurrentUserContext);
}
