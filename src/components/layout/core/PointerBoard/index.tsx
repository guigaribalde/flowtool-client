import UserPointerContextProvider from '@/utils/contexts/UserPointerContext/UserPointerContext';
import PointerBoardComponent from './PointerBoard';

export default function PointerBoard() {
	return (
		<UserPointerContextProvider>
			<PointerBoardComponent />
		</UserPointerContextProvider>
	);
}
