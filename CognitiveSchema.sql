CREATE TABLE Role
(RoleId INT not null ,
RoleType nvarchar(256) null,
RoleDesc nvarchar(256) null,
Primary Key(RoleId));

CREATE TABLE RANK(
	RankID 		INT   NOT NULL   AUTO_INCREMENT,
	RankName	 NVARCHAR(256) NULL,
	RankDesc	 NVARCHAR(256) NULL,
	PRIMARY KEY (RankID)
);

CREATE TABLE RegularUser (
    ID            INT             NOT NULL AUTO_INCREMENT,
    Username       NVARCHAR (256) NULL,
    FullName       NVARCHAR (256) NULL,
    Occupation     NVARCHAR (256) NULL,
    Email          NVARCHAR (256) NULL,
    Age            INT            NOT NULL,
    RegisteredDate NVARCHAR (256) NULL,
    LastAccess     NVARCHAR (256) NULL,
	FirstTimeRecommendedWidget NVARCHAR(256) NULL,
    PhoneNumber    INT            NOT NULL,
    Role_RoleId    INT            NOT NULL,
	Rank_RankId	   INT 			   NULL,
    PRIMARY KEY (ID),
    FOREIGN KEY (Role_RoleId) REFERENCES Role(RoleId),
	FOREIGN KEY (Rank_RankId) REFERENCES Rank(RankId)
);

CREATE TABLE Decision(
	DecisionId	INT NOT NULL AUTO_INCREMENT,
	ActionName NVARCHAR(256) NULL,
	PRIMARY KEY (DecisionId)
);

CREATE TABLE RegularUser_Decision(
	RegularUser_ID INT NOT NULL,
	Decision_DecisionId INT NOT NULL,
	PRIMARY KEY (RegularUser_ID, Decision_DecisionId),
	FOREIGN KEY (RegularUser_ID) REFERENCES RegularUser(ID),
	FOREIGN KEY (Decision_DecisionId) REFERENCES Decision(DecisionId)
);

CREATE TABLE Session (
    SessionID      INT             NOT NULL AUTO_INCREMENT,
    SessionDate    NVARCHAR (256) NULL,
    StartTime      NVARCHAR (256) NULL,
    EndTime        NVARCHAR (256) NULL,
    RegularUser_ID INT            NOT NULL,
    PRIMARY KEY (SessionID),
    FOREIGN KEY (RegularUser_ID) REFERENCES RegularUser(ID)
);

CREATE TABLE Dashboard(
	DashboardId INT NOT NULL AUTO_INCREMENT,
	DashboardName NVARCHAR(256) NOT NULL,
	DashboardDesc TEXT NULL,
	CreatedDate NVARCHAR (256) NULL,
	RegularUser_ID INT NOT NULL,
	PRIMARY KEY (DashboardId),
	FOREIGN KEY (RegularUser_ID) REFERENCES RegularUser(ID)	
);


CREATE TABLE Widget (
    WidgetID   INT            NOT NULL AUTO_INCREMENT,
    WidgetName NVARCHAR (256) NULL,
    HTMLId     NVARCHAR (256) NULL,
	WidgetType NVARCHAR(256)  NULL,
	WidgetQuery TEXT NULL,
	WidgetXAxis NVARCHAR(256) NULL,
	WidgetYAxis NVARCHAR(256) NULL,
	Dashboard_DashboardId INT NULL,
    PRIMARY KEY (WidgetID),
	FOREIGN KEY (Dashboard_DashboardId) REFERENCES Dashboard(DashboardId)
);


CREATE TABLE StandAloneElement (
    WidgetID    INT            NOT NULL AUTO_INCREMENT,
    LinkToPopUp NVARCHAR (256) NULL,
    WidgetName  NVARCHAR (256) NULL,
    HTMLId      NVARCHAR (256) NULL,
    TopX        INT            NOT NULL,
    TopY        INT            NOT NULL,
    WWidth      INT            NOT NULL,
    WHeight     INT            NOT NULL,
    PRIMARY KEY (WidgetID)
);

CREATE TABLE Record (
    RecordID                    INT      NOT NULL AUTO_INCREMENT,
    ScreenWidth                INT        NOT NULL,
    ScreenLength               INT        NOT NULL,
    CoordX                     INT        NOT NULL,
    CoordY                     INT        NOT NULL,
    Clicked                    BOOLEAN        NOT NULL,
    TimeStamp                  FLOAT (53) NOT NULL,
    FPS                        INT        NOT NULL,
    Session_SessionID          INT        NULL,
    Widget_WidgetID            INT        NULL,
    StandAloneElement_WidgetID INT        NULL,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (Session_SessionID) REFERENCES Session (SessionID),
    FOREIGN KEY (Widget_WidgetID) REFERENCES Widget (WidgetID),
    FOREIGN KEY (StandAloneElement_WidgetID) REFERENCES StandAloneElement(WidgetID)
);
INSERT INTO Rank  VALUES (1, 'Novice', 'Newly users who enters the system');
INSERT INTO Rank  VALUES (2, 'Expert', 'Users who have been using the system for a while, know all the features and where to go');
INSERT INTO Rank  VALUES (3, 'Advanced',  'Know the web sites well, can go through all the details');

INSERT INTO Role VALUES (1, "Financial Executive", "Interested in financial document and company transactions");
INSERT INTO Role VALUES (2, "Logistic", "We will add something");
INSERT INTO Role VALUES (3, "Transaction Manager", "Manage daily transactions and daily incomes");


INSERT INTO Widget VALUES (null, 'Item Selection', 'DIV#Item selection', null,null,null);
INSERT INTO Widget VALUES (2, 'Time and Cost', 'DIV#Time and Cost' ,null,null,null);
INSERT INTO Widget VALUES (3, 'Repairable Cost Trend', 'DIV#Cost Trend',null,null,null);
INSERT INTO Widget VALUES (4, 'Number of Repairs Per Year', 'DIV#Number of Repairs',null,null,null);
INSERT INTO Widget VALUES (5, 'Work Orders', 'DIV#Work Orders',null,null,null);
INSERT INTO Widget VALUES (6, 'Demand Supplier Locations ', 'DIV#Demand/Supplier Locations',null,null,null);
INSERT INTO Widget VALUES (7, 'Top 5 Suppliers', 'DIV#Top 5 Suppliers',null,null,null);
INSERT INTO Widget VALUES (8, 'Suppliers and Supplier Performance', 'Suppliers and Suppliers Performance',null,null,null);
INSERT INTO Widget VALUES (9, 'Failure Causes', 'DIV#Failure Causes',null,null,null);


	/*CREATE TABLE DataGroup(
	GroupID INT NOT NULL AUTO_INCREMENT,
	DataClass NVARCHAR(256) NULL,
	Representation NVARCHAR(256) NULL,
	PRIMARY KEY (GroupID)
);

	FOREIGN KEY (DataGroup_GroupID) REFERENCES DataGroup(GroupID)*/

DROP TABLE webpages_membership;
DROP TABLE webpages_oauthmembership;
DROP TABLE webpages_oauthtoken;
DROP TABLE webpages_usersinroles;
DROP TABLE webpages_roles;

DROP TABLE record;
DROP TABLE widget;
DROP TABLE standaloneelement;
DROP TABLE session;
DROP TABLE role;
DROP TABLE rank;
DROP TABLE decision;
DROP TABLE regularuser;
DROP TABLE dashboard;
DROP TABLE datagroup;