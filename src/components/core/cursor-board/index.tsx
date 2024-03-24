import UserPointerContextProvider from '@/utils/contexts/UserPointerContext/UserPointerContext';
import PointerBoardComponent from './cursor-board';

export default function PointerBoard() {
	return (
		<UserPointerContextProvider>
			<PointerBoardComponent />
		</UserPointerContextProvider>
	);
}
