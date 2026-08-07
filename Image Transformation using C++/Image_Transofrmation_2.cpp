#include <iostream>
#include <fstream>
#include <vector>
#include <cmath>
#include <algorithm>
using namespace std;

struct Image {
	char ImageFileName[100];
	vector<vector<int>> ImageData;
	int cols, rows, maxGray;
	vector<char> comment;
	bool imageLoaded;
	bool imageModified;
	void rotateImage90Degrees(bool clockwise) {
		if (!imageLoaded) {
			cout << "Error: Image not loaded." << endl;
			return;
		}
		const int newRows = cols;
		const int newCols = rows;
		vector<vector<int>> rotatedData(newRows, vector<int>(newCols, 0));
		if (clockwise == true) {
			for (int r = 0; r < rows; r++) {
				for (int c = 0; c < cols; c++) {
					rotatedData[c][rows - 1 - r] = ImageData[r][c];
				}
			}
		}
		else {
			for (int r = 0; r < rows; r++) {
				for (int c = 0; c < cols; c++) {
					rotatedData[cols - 1 - c][r] = ImageData[r][c];
				}
			}
		}
		rows = newRows;
		cols = newCols;
		ImageData = rotatedData;
		imageModified = true;
	}

	void enhanceImage() {
		vector<int> histogram(maxGray + 1, 0);
		for (int r = 0; r < rows; ++r) {
			for (int c = 0; c < cols; ++c) {
				histogram[ImageData[r][c]]++;
			}
		}
		vector<int> cdf(maxGray + 1, 0);
		cdf[0] = histogram[0];
		for (int i = 1; i <= maxGray; ++i) {
			cdf[i] = cdf[i - 1] + histogram[i];
		}

		for (int r = 0; r < rows; ++r) {
			for (int c = 0; c < cols; ++c) {
				ImageData[r][c] = int((cdf[ImageData[r][c]] * maxGray) / double(rows * cols));
			}
		}
		imageModified = true;
	}

	void EdgeDetection(vector<vector<int>> ImgData)
	{
		const int ROWS = ImgData.size();
		const int COLUMNS = ImgData[0].size();
		vector<vector<int>> edgeImageData(ROWS, vector<int>(COLUMNS, 0));
		vector<vector<int>> sobel_X = { { -1, 0, 1 }, { -2, 0, 2 }, { -1, 0, 1 } };
		vector<vector<int>> sobel_Y = { { -1, -2, -1 }, { 0, 0, 0 }, { 1, 2, 1 } };
		for (int r = 1; r < ROWS - 1; r++)
		{
			for (int c = 1; c < COLUMNS - 1; c++)
			{
				int X = 0;
				int Y = 0;
				for (int i = -1; i <= 1; i++)
				{
					for (int j = -1; j <= 1; j++)
					{
						X += sobel_X[i + 1][j + 1] * ImgData[r + i][c + j];
						Y += sobel_Y[i + 1][j + 1] * ImgData[r + i][c + j];
					}
				}
				edgeImageData[r][c] = sqrt(X * X + Y * Y);
			}
		}
		ImageData = edgeImageData;
	}

	void FindDerivative(vector<vector<int>> ImgData)
	{
		const int ROWS = ImgData.size();
		const int COLUMNS = ImgData[0].size();
		vector<vector<int>> derImgData(ROWS, vector<int>(COLUMNS, 0));
		vector<vector<int>> sobel_X = { { -1, 0, 1 }, { -2, 0, 2 }, { -1, 0, 1 } };
		for (int r = 1; r < ROWS - 1; r++)
		{
			for (int c = 1; c < COLUMNS - 1; c++)
			{
				int X = 0;

				for (int i = -1; i <= 1; i++)
				{
					for (int j = -1; j <= 1; j++)
					{
						X += sobel_X[i + 1][j + 1] * ImgData[r + i][c + j];
					}
				}
				derImgData[r][c] = X;
			}
		}
		ImageData = derImgData;
	}




	void applyLinearFilterFromFile(const string filterFile) {
		vector<std::vector<double>> filter;
		if (!loadFilterFromFile(filterFile, filter)) {
			cout << "Error: Unable to load filter from file." << endl;
			return;
		}
		vector<vector<int>> result(rows, vector<int>(cols, 0));
		int filterRows = int(filter.size());
		int filterCols = int(filter[0].size());
		for (int r = 0; r < rows; ++r) {
			for (int c = 0; c < cols; ++c) {
				double sum = 0.0;
				for (int i = 0; i < filterRows; ++i) {
					for (int j = 0; j < filterCols; ++j) {
						int imageRow = r - filterRows / 2 + i;
						int imageCol = c - filterCols / 2 + j;
						if (imageRow >= 0 && imageRow < rows && imageCol >= 0 && imageCol < cols) {
							sum += double(ImageData[imageRow][imageCol]) * filter[i][j];
						}
					}
				}
				result[r][c] = int(sum);
			}
		}

		ImageData = result;
		cout << "Linear filter applied. You need to save the changes." << endl;
	}

	bool loadFilterFromFile(const string filterFile, vector<vector<double>> filter) {
		ifstream file(filterFile);
		if (!file.is_open()) {
			return false;
		}
		filter.clear();
		double value;
		while (file >> value) {
			filter.emplace_back();
			filter.back().push_back(value);
			while (file.peek() == ' ' || file.peek() == '\t') {
				file.ignore();
				if (file >> value) {
					filter.back().push_back(value);
				}
			}
		}
		return true;
	}


	void applyMeanFilter() {
		vector<vector<int>> newImageData(rows, vector<int>(cols, 0));
		for (int r = 1; r < rows - 1; r++)
		for (int c = 1; c < cols - 1; c++) {
			int sum = 0;
			for (int i = -1; i <= 1; i++)
			for (int j = -1; j <= 1; j++)
				sum += ImageData[r + i][c + j];
			newImageData[r][c] = sum / 9;
		}
		ImageData = newImageData;
		imageModified = true;
	}

	void contrastStretch() {
		if (!imageLoaded) {
			cout << "Error: Image not loaded." << endl;
			return;
		}
		int minPixel = ImageData[0][0];
		int maxPixel = ImageData[0][0];
		for (int r = 0; r < rows; ++r) {
			for (int c = 0; c < cols; ++c) {
				minPixel = min(minPixel, ImageData[r][c]);
				maxPixel = max(maxPixel, ImageData[r][c]);
			}
		}
		double range = maxPixel - minPixel;
		for (int r = 0; r < rows; ++r) {
			for (int c = 0; c < cols; ++c) {
				double stretchedPixel = (ImageData[r][c] - minPixel) * (maxGray / range);
				ImageData[r][c] = stretchedPixel;
			}
		}
		imageModified = true;
	}


	void adjustSharpness(double factor) {
		if (!imageLoaded) {
			cout << "Error: Image not loaded." << endl;
			return;
		}
		vector<vector<double>> highPassFilter = {
			{ -1, -1, -1 },
			{ -1, 8 + factor, -1 },
			{ -1, -1, -1 }
		};
		vector<vector<int>> sharpenedData(rows, vector<int>(cols, 0));
		for (int r = 1; r < rows - 1; ++r) {
			for (int c = 1; c < cols - 1; ++c) {
				double sum = 0.0;

				for (int i = -1; i <= 1; ++i) {
					for (int j = -1; j <= 1; ++j) {
						sum += ImageData[r + i][c + j] * highPassFilter[i + 1][j + 1];
					}
				}
				int resultPixel = max(0, min(int(sum), maxGray));
				sharpenedData[r][c] = resultPixel;
			}
		}
		ImageData = sharpenedData;
		imageModified = true;
	}

	void convertToBinary() {
		for (int r = 0; r < rows; ++r) {
			for (int c = 0; c < cols; ++c) {
				if (ImageData[r][c] < (maxGray / 2)) {
					ImageData[r][c] = 0;
				}
				else {
					ImageData[r][c] = maxGray;
				}
			}
		}
		imageModified = true;
	}

	void resizeImage(int newRows, int newCols) {
		if (!imageLoaded) {
			cout << "Error: Image not loaded." << endl;
			return;
		}
		double rowScale = rows / double(newRows);
		double colScale = cols / double(newCols);
		vector<vector<int>> resizedData(newRows, vector<int>(newCols, 0));
		for (int r = 0; r < newRows; r++) {
			for (int c = 0; c < newCols; c++) {
				int originalRow = int(r * rowScale);
				int originalCol = int(c * colScale);
				resizedData[r][c] = ImageData[originalRow][originalCol];
			}
		}
		rows = newRows;
		cols = newCols;
		ImageData = resizedData;
		imageModified = true;
	}

	void rotateImage(int angle) {
		if (!imageLoaded) {
			cout << "Error: Image not loaded." << endl;
			return;
		}
		const double pi = 3.14159265358979323846;
		double radianAngle = angle * pi / 180.0;
		int newRows = int(abs(cols * sin(radianAngle)) + abs(rows * cos(radianAngle)));
		int newCols = int(abs(rows * sin(radianAngle)) + abs(cols * cos(radianAngle)));
		vector<vector<int>> rotatedData(newRows, vector<int>(newCols, 0));
		int centerX = cols / 2;
		int centerY = rows / 2;
		for (int r = 0; r < newRows; r++) {
			for (int c = 0; c < newCols; c++) {
				int originalX = int((c - newCols / 2) * cos(radianAngle) -
					(r - newRows / 2) * sin(radianAngle) + centerX);
				int originalY = int((c - newCols / 2) * sin(radianAngle) +
					(r - newRows / 2) * cos(radianAngle) + centerY);
				if (originalX >= 0 && originalX < cols && originalY >= 0 && originalY < rows) {
					rotatedData[r][c] = ImageData[originalY][originalX];
				}
			}
		}
		rows = newRows;
		cols = newCols;
		ImageData = rotatedData;
		imageModified = true;
	}


	void flipVertical() {
		for (int c = 0; c < cols; c++) {
			for (int r = 0; r < rows / 2; r++) {
				swap(ImageData[r][c], ImageData[rows - 1 - r][c]);
			}
		}
		imageModified = true;
	}

	void cropImage(int startX, int startY, int endX, int endY) {
		if (!imageLoaded) {
			cout << "Error: Image not loaded." << endl;
			return;
		}
		if (startX < 0 || startY < 0 || endX >= cols || endY >= rows || startX >= endX || startY >= endY) {
			cout << "Error: Invalid crop coordinates." << endl;
			return;
		}
		int newRows = endY - startY + 1;
		int newCols = endX - startX + 1;
		vector<vector<int>> croppedData(newRows, vector<int>(newCols, 0));
		for (int r = 0; r < newRows; r++) {
			for (int c = 0; c < newCols; c++) {
				croppedData[r][c] = ImageData[startY + r][startX + c];
			}
		}
		rows = newRows;
		cols = newCols;
		ImageData = croppedData;
		imageModified = true;
	}



	void combineImages(const Image& image2, bool sideBySide) {
		if (!imageLoaded || !image2.imageLoaded) {
			cout << "Error: One or both images not loaded." << endl;
			return;
		}
		vector<vector<int>> combinedData;
		if (sideBySide) {
			if (rows != image2.rows) {
				cout << "Error: Images have different heights and cannot be combined side by side." << endl;
				return;
			}
			combinedData.resize(rows, vector<int>(cols + image2.cols, 0));
			for (int r = 0; r < rows; r++) {
				for (int c = 0; c < cols; c++) {
					combinedData[r][c] = ImageData[r][c];
					combinedData[r][c + cols] = image2.ImageData[r][c];
				}
			}
			cols += image2.cols;
		}
		else {
			if (cols != image2.cols) {
				cout << "Error: Images have different widths and cannot be combined vertically." << endl;
				return;
			}
			combinedData = ImageData;  
			for (int r = 0; r < image2.rows; r++) {
				vector<int> newRow(image2.cols, 0);
				for (int c = 0; c < image2.cols; c++) {
					newRow[c] = image2.ImageData[r][c];
				}
				combinedData.push_back(newRow);
			}
			rows += image2.rows;
		}
		ImageData = combinedData;
		imageModified = true;
	}


	void medianFilter() {
		if (!imageLoaded) {
			cout << "Error: Image not loaded." << endl;
			return;
		}
		int windowSize = 3;
		int halfSize = windowSize / 2;
		vector<vector<int>> filteredData(rows, vector<int>(cols, 0));
		for (int i = 0; i < rows; i++) {
			for (int j = 0; j < cols; j++) {
				vector<int> windowValues;
				for (int m = -halfSize; m <= halfSize; m++) {
					for (int n = -halfSize; n <= halfSize; n++) {
						int ii = i + m;
						int jj = j + n;

						if (ii >= 0 && ii < rows && jj >= 0 && jj < cols) {
							windowValues.push_back(ImageData[ii][jj]);
						}
					}
				}
				int windowSize = windowValues.size();
				int k = windowSize / 2;
				int min, temp;
				for (int x = 0; x <= k; x++) {
					min = x;
					for (int y = x + 1; y < windowSize; y++) {
						if (windowValues[y] < windowValues[min]) {
							min = y;
						}
					}
					temp = windowValues[x];
					windowValues[x] = windowValues[min];
					windowValues[min] = temp;
				}
				filteredData[i][j] = windowValues[k];
			}
		}
		ImageData = filteredData;
		imageModified = true;
	}


	void scaleImage(double scaleFactor) {
		if (scaleFactor <= 0) {
			cout << "Invalid scale factor. It must be greater than 0." << endl;
			return;
		}
		int newRows = rows * scaleFactor;
		int newCols = cols * scaleFactor;
		vector<vector<int>> newImageData(newRows, vector<int>(newCols, 0));
		for (int r = 0; r < newRows; r++)
		for (int c = 0; c < newCols; c++) {
			int originalR = r / scaleFactor;
			int originalC = c / scaleFactor;
			if (originalR >= 0 && originalR < rows && originalC >= 0 && originalC < cols)
				newImageData[r][c] = ImageData[originalR][originalC];
		}
		ImageData = newImageData;
		rows = newRows;
		cols = newCols;
	}

#include <vector>

	void translateImage(int horizontalShift, int verticalShift) {
		vector<vector<int>> originalData = ImageData;
		int newRows = rows + abs(verticalShift);
		int newCols = cols + abs(horizontalShift);
		ImageData.clear();
		ImageData.resize(newRows,vector<int>(newCols, 0));
		for (int r = 0; r < rows; r++) {
			for (int c = 0; c < cols; c++) {
				int newR = r - verticalShift; 
				int newC = c + horizontalShift;
				if (newR >= 0 && newR < newRows && newC >= 0 && newC < newCols) {
					ImageData[newR][newC] = originalData[r][c];
				}
			}
		}
		rows = newRows;
		cols = newCols;
	}





	void changeBrightness(double factor) {
		cout << "Enter the multiplying factor for brightness: ";
		cin >> factor;
		for (int r = 0; r < rows; r++)
		for (int c = 0; c < cols; c++) {
			ImageData[r][c] *= factor;
			if (ImageData[r][c] > maxGray)
				ImageData[r][c] = maxGray;
			else if (ImageData[r][c] < 0)
				ImageData[r][c] = 0;
		}
	}

	int loadImage(char ImageName[]) {
		ifstream FCIN(ImageName);

		if (!FCIN.is_open())
			return -1;

		char MagicNumber[5];
		char Comment[100];

		FCIN.getline(MagicNumber, 4);
		FCIN.getline(Comment, 100);

		if (FCIN.fail()) {
			cout << "Error reading MagicNumber or Comment." << endl;
			return -2;
		}

		FCIN >> cols >> rows >> maxGray;

		if (FCIN.fail()) {
			cout << "Error reading cols, rows, or maxGray." << endl;
			return -3;
		}

		ImageData.clear();
		ImageData.resize(rows, vector<int>(cols, 0));

		for (int r = 0; r < rows; r++) {
			for (int c = 0; c < cols; c++) {
				if (!(FCIN >> ImageData[r][c])) {
					cout << "Error reading pixel data at row " << r << ", column " << c << "." << endl;
					return -4;
				}
			}
		}

		if (FCIN.fail()) {
			cout << "Error reading pixel data." << endl;
			return -4;
		}

		FCIN.close();
		imageLoaded = true;
		imageModified = false;
		strcpy_s(ImageFileName, ImageName);
		return 0;
	}


	int saveImage(char ImageName[]) {
		ofstream FCOUT(ImageName);
		if (!FCOUT.is_open())
			return -1;

		FCOUT << "P2\n# This is a comment\n"
			<< cols << " " << rows << endl
			<< maxGray << endl;
		for (int r = 0; r < rows; r++) {
			for (int c = 0; c < cols; c++)
				FCOUT << ImageData[r][c] << " ";
			FCOUT << endl;
		}
		FCOUT.close();
		imageModified = false;
		return 0;
	}

	void horzontalFlipImage() {
		for (int r = 0; r < rows; r++) {
			for (int c = 0; c < cols / 2; c++) {
				swap(ImageData[r][c], ImageData[r][cols - 1 - c]);
			}
		}
		imageModified = true;
	}

};

struct Menu {
	vector<string> menuItems;

	Menu() {}

	int loadMenu(char menuFile[]) {
		ifstream IN(menuFile);

		if (!IN.is_open())
			return -1;

		char menuItem[100], TotalItems[10];

		int Choices;

		IN.getline(TotalItems, 8);
		Choices = atoi(TotalItems);

		for (int i = 1; i <= Choices; i++) {
			IN.getline(menuItem, 99);
			menuItems.push_back(menuItem);
		}

		IN.close();
		return Choices;
	}

	int presentMenu() {
		int userChoice;
		int totalChoices = menuItems.size();

		do {
			int k = 1;

			for (size_t i = 0; i < totalChoices; i++) {
				if (!menuItems[i].empty() && menuItems[i][0] != '*') {
					cout << k << "\t" << menuItems[i].c_str() << endl;
					k++;
				}
			}

			cout << " Enter Your Choice (1 - " << k - 1 << " ) ";
			cin >> userChoice;

		} while (userChoice < 1 || userChoice > totalChoices);

		return userChoice;
	}
};

int main() {
	char MenuFile[] = "MainMenu.txt";
	Image images[2];
	int activeImage = 0;
	int errorCode = 0;
	int userChoice;
	char MenuFileCharArray[] = "MainMenu.txt";
	string MenuFileString = "MainMenu.txt";
	Menu menu;
	int totalChoices = menu.loadMenu(MenuFileCharArray);

	do {
		userChoice = menu.presentMenu();

		if (userChoice == 1) {
			char ImageFileName[100];
			cout << "Specify File Name ";
			cin >> ImageFileName;
			errorCode = images[activeImage].loadImage(ImageFileName);

			if (errorCode == 0) {
				cout << "File Loaded Successfully " << endl;
			}
			else {
				cout << "Load Error: Code " << errorCode << endl;
			}
		}
		else if (userChoice == 2) {
			char ImageFileName[100];
			cout << "Specify File Name ";
			cin >> ImageFileName;
			errorCode = images[activeImage].saveImage(ImageFileName);
			if (errorCode == 0) {
				cout << "File Saved as " << ImageFileName << endl;
			}
			else {
				cout << "Save Error: Code " << errorCode << endl;
			}
		}
		else if (userChoice == 3) {
			images[activeImage].horzontalFlipImage();
			cout << "You need to save the changes " << endl;
		}
		else if (userChoice == 4) {
			images[activeImage].flipVertical();
			cout << "You need to save the changes." << endl;
		}
		else if (userChoice == 5) {
			images[activeImage].changeBrightness(0.4);
			cout << "Brightness changed successfully." << endl;
		}
		else if (userChoice == 6) {
			int dx, dy;
			cout << "Enter translation in x-direction: ";
			cin >> dx;
			cout << "Enter translation in y-direction: ";
			cin >> dy;
			images[activeImage].translateImage(dx, dy);
			cout << "Image translated successfully." << endl;
		}
		else if (userChoice == 7) {
			double scaleFactor;
			cout << "Enter the scale factor: ";
			cin >> scaleFactor;
			images[activeImage].scaleImage(scaleFactor);
			cout << "Image scaled successfully." << endl;
		}
		else if (userChoice == 8) {
			images[activeImage].applyMeanFilter();
			cout << "Mean Filter applied successfully" << endl;
		}
		else if (userChoice == 9) {
			images[activeImage].medianFilter();
			cout << "Median Filter applied successfully" << endl;
		}
		else if (userChoice == 10) {
			images[activeImage].contrastStretch();
			cout << "Contrast stretching applied. You need to save the changes." << endl;
		}
		else if (userChoice == 11) {
			images[activeImage].adjustSharpness(1.0);
			cout << "Sharpness adjusted. You need to save the changes." << endl;
		}
		else if (userChoice == 12) {
			images[activeImage].convertToBinary();
			cout << "Image converted to binary format. You need to save the changes." << endl;
		}
		else if (userChoice == 13) {
			int newRows, newCols;
			cout << "Enter the new number of rows: ";
			cin >> newRows;
			cout << "Enter the new number of columns: ";
			cin >> newCols;
			images[activeImage].resizeImage(newRows, newCols);
			cout << "Image resized successfully." << endl;
		}
		else if (userChoice == 14) {
			int angle;
			cout << "Enter the rotation angle: ";
			cin >> angle;
			images[activeImage].rotateImage(angle);
			cout << "Image rotated. You need to save the changes." << endl;
		}
		else if (userChoice == 15) {
			char rotationDirection;
			cout << "Enter 'C' for clockwise or 'A' for anticlockwise rotation: ";
			cin >> rotationDirection;

			bool clockwiseRotation;
			if (rotationDirection == 'C' || rotationDirection == 'c') {
				clockwiseRotation = true;
			}
			else if (rotationDirection == 'A' || rotationDirection == 'a') {
				clockwiseRotation = false;
			}
			else {
				cout << "Invalid input. Please enter 'C' or 'A'." << endl;
				continue;
			}
			images[activeImage].rotateImage90Degrees(clockwiseRotation);
			cout << "Image rotated by 90 degrees. You need to save the changes." << endl;
		}
		else if (userChoice == 16) {
			int startX, startY, endX, endY;
			cout << "Enter crop coordinates (startX startY endX endY): ";
			cin >> startX >> startY >> endX >> endY;
			images[activeImage].cropImage(startX, startY, endX, endY);
			cout << "Image cropped. You need to save the changes." << endl;
		}
		else if (userChoice == 17) {
			int otherImageIndex;
			cout << "Enter the index of the other image to combine with (0 or 1): ";
			cin >> otherImageIndex;
			if (otherImageIndex >= 0 && otherImageIndex < 2) {
				bool sideBySide;
				cout << "Combine side by side? (1 for true, 0 for false): ";
				cin >> sideBySide;
				images[activeImage].combineImages(images[otherImageIndex], sideBySide);
				cout << "Images combined." << endl;
			}
			else {
				cout << "Invalid image index." << endl;
			}
		}
		else if (userChoice == 18) {
			char filterFile[100];
			cout << "Enter the filter file name: ";
			cin >> filterFile;
			images[activeImage].applyLinearFilterFromFile(filterFile);
			cout << "Linear filter applied. You need to save the changes." << endl;
		}
		else if (userChoice == 19) {
			vector<vector<int>> xDerivative, yDerivative, edgeMagnitude;
			images[activeImage].EdgeDetection(images[activeImage].ImageData);
			cout << "Edges detected using SOBEL operator. You need to save the changes." << endl;
		}
		else if (userChoice == 20) {
			vector<vector<int>> xDerivative, yDerivative, edgeMagnitude;
			images[activeImage].FindDerivative(images[activeImage].ImageData);
			cout << "Derivative computed using SOBEL operator. You need to save the changes." << endl;
		}

		else if (userChoice == 21) {
			images[activeImage].enhanceImage();
			cout << "Image enhanced using Histogram Equalization. You need to save the changes." << endl;
		}
		else if (userChoice == 22){

		}
		cin.ignore(numeric_limits<streamsize>::max(), '\n');  //This statement was taken from an AI as in VS 2013 the compiler was giving error on the vector limit or subscript
	} while (userChoice != totalChoices);
	return 0;
}
