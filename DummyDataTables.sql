CREATE TABLE Customers
( CustId INT(100),
  Name VARCHAR(70),
  Age Int(100),
  Phone Int(100),
  Primary key(CustID)
 );
 
CREATE TABLE Employees
( EmployeeId INT(100),
  Name VARCHAR(70),
  Age Int(100),
  Phone Int(100),
  Primary key(EmployeeId)
 );

 CREATE TABLE Suppliers
( SupplierID INT(100),
  ContactName VARCHAR(80),
  SupplyDate DATE,
  Primary key(SupplierID)
 );
 
 CREATE TABLE Accounts
( ReceiptNumber INT(100),
  SupplierID INT(100),
  CustId INT(100),
  CurrentBalance INT(100),
  Primary key(ReceiptNumber, SupplierID, CustID),
  Foreign key(SupplierID) REFERENCES Suppliers(SupplierID),
  Foreign key(CustId) REFERENCES Customers(CustId)
 );
 
 CREATE TABLE Products
( ProductId INT(100),
  SupplierID Int(100),
  Stocklevel Int(100),
  UnitPrice Int(100),
  Primary key(ProductId, SupplierID),
  Foreign key(SupplierID) REFERENCES Suppliers(SupplierID)
 );

CREATE TABLE Transacts
(  
  TransacNumber INT(100),
  ReceiptNumber INT(100),
  TransDate DATE,
  Amount Int(100),
  Primary key(TransacNumber, ReceiptNumber),
  Foreign key(ReceiptNumber) REFERENCES Accounts(ReceiptNumber)
 );
 
 CREATE TABLE Banks
(
  BankNum INT(100),
  Address VARCHAR(80),
  Phone Int(100),
  Primary key(BankNum)
);

CREATE TABLE Loans
(
  LoanNum INT(100),
  SupplierID Int(100),
  BankNum Int(100),
  InterestRate Int(100),
  initilAmount Int(100),
  CurrentBalance INT(100),
  Primary key(LoanNum, SupplierID, BankNum),
  Foreign key(SupplierID) REFERENCES Suppliers(SupplierID),
  Foreign key(BankNum) REFERENCES Banks(BankNum)
);
   
CREATE TABLE Payments
(
  PaymentNum INT(100), 
  LoanNum INT(100),
  PaymentDate DATE,
  PaymentAmount INT(100),
  Primary key(PaymentNum,LoanNum),
  Foreign key(LoanNum) REFERENCES Loans(LoanNum)
);

CREATE TABLE Sales
(
  SaleID Int(100), 
  DATEOFSALE DATE,
  EmployeeId INT(100),
  CustID INT(100),
  ProductID INT(100),
  Primary Key(SaleID,EmployeeId, CustId),
  Foreign key(EmployeeId) REFERENCES Employees(EmployeeId),
  Foreign key(CustId) REFERENCES Customers(CustId)
);

INSERT INTO CUSTOMERS
VALUES (2314, 'John', 24, 041567123);

INSERT INTO CUSTOMERS
VALUES (3314, 'Lam', 22, 04123671);

INSERT INTO CUSTOMERS
VALUES (4314, 'Eddard', 34, 04123453);

INSERT INTO CUSTOMERS
VALUES (5314, 'Jamie', 23, 046778123);

INSERT INTO CUSTOMERS
VALUES (6314, 'Tyrion', 22, 04356471);

INSERT INTO CUSTOMERS
VALUES (7314, 'Tywin', 54, 04436553);

INSERT INTO CUSTOMERS
VALUES (8314, 'Joffery', 18, 04365123);

INSERT INTO CUSTOMERS
VALUES (9314, 'Cersie', 33, 04156671);

INSERT INTO CUSTOMERS
VALUES (1214, 'Arya', 15, 04346453);


INSERT INTO Employees
VALUES (5314, 'AShton', 26, 047345657);

INSERT INTO Employees
VALUES (5315, 'Emilly', 27, 04389575);

INSERT INTO Employees
VALUES (5314, 'Michael', 36, 0489743);

INSERT INTO Employees
VALUES (5316, 'Larys', 45, 04457857);

INSERT INTO Employees
VALUES (5317, 'Jorah', 37, 04346785);

INSERT INTO Employees
VALUES (5318, 'Lyana', 36, 043478943);

INSERT INTO Employees
VALUES (5319, 'Catelyn', 46, 04734557);

INSERT INTO Employees
VALUES (5311, 'Daneyrs', 21, 04345765);

INSERT INTO Employees
VALUES (5312, 'Baelish', 36, 042355673);



INSERT INTO Suppliers
VALUES (1123, 'OricaSupplier', '2013-01-21');

INSERT INTO Suppliers
VALUES (1124, 'Transfield', '2014-5-13');

INSERT INTO Suppliers
VALUES (1125, 'Mcdonalds', '2013-3-17');

INSERT INTO Suppliers
VALUES (1126, 'Apple', '2013-9-23');

INSERT INTO Suppliers
VALUES (1127, 'Walmart', '2015-10-3');

INSERT INTO Suppliers
VALUES (1128, 'Zara', '2016-7-8');

INSERT INTO Suppliers
VALUES (1129, 'Microsoft', '2015-1-12');

INSERT INTO Suppliers
VALUES (1121, 'IBM', '2014-5-13');

INSERT INTO Suppliers
VALUES (1122, 'Nike', '2013-3-17');


INSERT INTO Accounts
VALUES (234, 1123, 2314, 270);

INSERT INTO Accounts
VALUES (235, 1124,3314, 2456);

INSERT INTO Accounts
VALUES (236, 1125, 4314, 2560);

INSERT INTO Accounts
VALUES (237, 1122, 5314, 4570);

INSERT INTO Accounts
VALUES (238, 1121, 7314, 11356);

INSERT INTO Accounts
VALUES (239, 1126, 5314, 25560);

INSERT INTO Accounts
VALUES (230, 1127, 6314, 27000);

INSERT INTO Accounts
VALUES (231, 1128, 8314, 28560);

INSERT INTO Accounts
VALUES (232, 1129, 9314, 29345);

INSERT INTO Products
VALUES (1221, 1121, 34, 45);

INSERT INTO Products
VALUES (1222, 1122, 44, 55);

INSERT INTO Products
VALUES (1223, 1123, 54, 55);

INSERT INTO Products
VALUES (1224, 1124, 64, 65);

INSERT INTO Products
VALUES (1225, 1125, 74, 75);

INSERT INTO Products
VALUES (1226, 1126, 84, 85);

INSERT INTO Products
VALUES (1227, 1127, 94, 95);

INSERT INTO Products
VALUES (1228, 1128, 104, 105);

INSERT INTO Products
VALUES (1229, 1129, 124, 165);




INSERT INTO Transacts
VALUES (5511, 230, '2013-1-23', 270);

INSERT INTO Transacts
VALUES (5512, 239, '2014-5-13', 2186);

INSERT INTO Transacts
VALUES (5513, 234, '2013-3-17', 104);

INSERT INTO Transacts
VALUES (5514, 235, '2013-9-23', 2010);

INSERT INTO Transacts
VALUES (5515, 238, '2015-3-10', 6786);

INSERT INTO Transacts
VALUES (5516, 239, '2016-7-8', 14204);

INSERT INTO Transacts
VALUES (5517, 239, '2015-1-13', 1440);

INSERT INTO Transacts
VALUES (5518, 235, '2014-5-13', 1560);

INSERT INTO Transacts
VALUES (5519, 236, '2013-3-17', 785);


INSERT INTO Loans
VALUES (3311, 1127, 1, 12, 40000, 70000);

INSERT INTO Loans
VALUES (3312, 1128, 2, 15, 60000, 95000);

INSERT INTO Loans
VALUES (3313, 1129, 3, 11, 20000, 50000);


INSERT INTO Payments
VALUES (4411, 3311, '2014-12-20', 30000);

INSERT INTO Payments
VALUES (4412, 3312, '2014-2-10', 40000);

INSERT INTO Payments
VALUES (4413, 3313, '2014-5-14', 50000);


INSERT INTO SALES
VALUES (123, '2014-11-5', 5318, 7314, 1223);

INSERT INTO SALES
VALUES (124, '2014-1-31', 5319, 4314, 1224);

INSERT INTO SALES
VALUES (124, '2014-3-24', 5312, 3314, 1226);

INSERT INTO Banks
VALUES (1, '132 Kings Str', 04341234);

INSERT INTO Banks
VALUES(2, '34 Victoria Bandae', 04343423);

INSERT INTO Banks 
VALUES (3, '56 Cooked Str', 04343432);
 