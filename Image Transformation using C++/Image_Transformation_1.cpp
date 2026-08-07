#include <iostream>
#include <fstream>
#include <string>

const int MaxRows = 14;
const int MaxCols = 14;
const int MaxPlayers = 2;
const char DefaultFill = '.';

char Board[MaxRows][MaxCols];
int Next_Move[MaxCols] = { 0 };
std::string PlayerNames[MaxPlayers];
char PlayerMarks[MaxPlayers] = { 'o', 'x' };
int TurningPlayer = 0;
int GameEndState = -1;
int Rows = 6;
int Columns = 7;
int ConnectLimit = 4;

int Menu() {
	int Choice;
	do {
		std::cout << "1. Play" << std::endl
			<< "2. Save Game" << std::endl
			<< "3. Load Game" << std::endl
			<< "4. Exit" << std::endl
			<< "Enter Your Choice (1 - 4): ";
		std::cin >> Choice;
	} while (Choice < 1 || Choice > 4);
	return Choice;
}

void initNewGame() {
	std::cout << "How Many Rows? ";
	std::cin >> Rows;
	std::cout << "How Many Cols? ";
	std::cin >> Columns;
	std::cout << "Connectivity Limit? ";
	std::cin >> ConnectLimit;
	std::cout << "First Player Name? ";
	std::cin >> PlayerNames[0];
	std::cout << "Second Player Name? ";
	std::cin >> PlayerNames[1];

	for (int r = 0; r < MaxRows; r++)
	for (int c = 0; c < MaxCols; c++)
		Board[r][c] = DefaultFill;

	for (int i = 0; i < MaxCols; i++)
		Next_Move[i] = 0;
}
bool SaveGame(const std::string &FileName) {
	std::ofstream file(FileName);
	if (!file) {
		return false;
	}
	file << Rows << " " << Columns << " " << ConnectLimit << " " << TurningPlayer << " " << GameEndState << "\n";
	file << PlayerNames[0] << " " << PlayerNames[1] << "\n";
	for (int i = 0; i < Columns; i++) {
		file << Next_Move[i] << " ";
	}
	file << "\n";
	for (int r = 0; r < Rows; r++) {
		for (int c = 0; c < Columns; c++) {
			file << Board[r][c] << " ";
		}
		file << "\n";
	}
	file.close();
	return true;
}

bool LoadSavedGame(const std::string &FileName) {
	std::ifstream file(FileName);
	if (!file) {
		return false;
	}
	file >> Rows >> Columns >> ConnectLimit >> TurningPlayer >> GameEndState;
	file >> PlayerNames[0] >> PlayerNames[1];
	for (int i = 0; i < Columns; i++) {
		file >> Next_Move[i];
	}
	for (int r = 0; r < Rows; r++) {
		for (int c = 0; c < Columns; c++) {
			file >> Board[r][c];
		}
	}
	file.close();
	return true;
}
bool CheckWinCondition(int Row, int Col) {
	char mark = PlayerMarks[TurningPlayer];
	int count = 1;
	for (int c = Col - 1; c >= 0 && Board[Row][c] == mark; --c, ++count);
	for (int c = Col + 1; c < Columns && Board[Row][c] == mark; ++c, ++count);
	if (count >= ConnectLimit)
		return true;

	count = 1;
	for (int r = Row - 1; r >= 0 && Board[r][Col] == mark; --r, ++count);
	for (int r = Row + 1; r < Rows && Board[r][Col] == mark; ++r, ++count);
	if (count >= ConnectLimit)
		return true;

	count = 1;
	for (int r = Row - 1, c = Col - 1; r >= 0 && c >= 0 && Board[r][c] == mark; --r, --c, ++count);
	for (int r = Row + 1, c = Col + 1; r < Rows && c < Columns && Board[r][c] == mark; ++r, ++c, ++count);
	if (count >= ConnectLimit)
		return true;
	count = 1;

	for (int r = Row - 1, c = Col + 1; r >= 0 && c < Columns && Board[r][c] == mark; --r, ++c, ++count);
	for (int r = Row + 1, c = Col - 1; r < Rows && c >= 0 && Board[r][c] == mark; ++r, --c, ++count);
	if (count >= ConnectLimit)
		return true;

	return false;
}

bool MakeMove(int Col) {
	int R = Next_Move[Col];
	if (R >= Rows)
		return false;

	Board[R][Col] = PlayerMarks[TurningPlayer];
	Next_Move[Col]++;
	if (CheckWinCondition(R, Col)) {
		GameEndState = TurningPlayer;
		return true;
	}
	TurningPlayer = (TurningPlayer + 1) % MaxPlayers;
	return true;
}
bool GameisOn() {
	return GameEndState == -1;
}

void ShowGame() {
	for (int c = 0; c < Columns; c++)
		std::cout << "_________";
	std::cout << std::endl;

	for (int c = 0; c < Columns; c++)
		std::cout << "\t" << c;
	std::cout << std::endl;

	for (int c = 0; c < Columns; c++)
		std::cout << "_________";
	std::cout << std::endl;

	for (int r = Rows - 1; r >= 0; r--) {
		std::cout << "| " << r << " |\t";
		for (int c = 0; c < Columns; c++)
			std::cout << Board[r][c] << "\t";
		std::cout << std::endl << "|   |" << std::endl;
	}

	for (int c = 0; c < Columns; c++)
		std::cout << "_________";
	std::cout << std::endl;

	if (!GameisOn()) {
		std::cout << "\tGame Over! Winner: " << PlayerNames[GameEndState]
			<< "(" << PlayerMarks[GameEndState] << ")"
			<< std::endl;
	}
	else {
		std::cout << std::endl << "\tPlayer:" << PlayerNames[TurningPlayer]
			<< "(" << PlayerMarks[TurningPlayer] << ")"
			<< " Moving " << std::endl;
	}
}

void Play() {
	int Move;
	do {
		ShowGame();
		std::cout << "\tENTER NEGATIVE NUMBER FOR THE MAIN MENU" << std::endl;
		std::cout << "\tPlease Enter Your Move ? (0 - " << Columns << "): ";
		std::cin >> Move;
		if (Move < 0)
			break;

		if (Move >= 0 && Move < Columns && !MakeMove(Move))
			std::cout << "Invalid move. Column is full. Try again." << std::endl;

	} while (GameisOn());
}

int main() {
	int Choice;
	bool GameNotLoaded = true;

	for (int i = 0; i < MaxCols; i++)
		Next_Move[i] = 0;

	do {
		Choice = Menu();
		switch (Choice) {
		case 1:
			if (GameNotLoaded) {
				initNewGame();
				GameNotLoaded = false;
			}
			Play();
			break;
		case 2:
			SaveGame("savegame.txt");
			break;
		case 3:
			LoadSavedGame("savegame.txt");
			break;
		}
	} while (Choice != 4);

	return 0;
}