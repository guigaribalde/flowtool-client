import { useContext } from 'react';
import { UsersContextState, UsersContext } from '../context/UsersContext';

export default function useUsers() {
	const query: UsersContextState = useContext(UsersContext);
	return query;
}
