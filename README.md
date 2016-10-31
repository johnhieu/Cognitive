# Cognitive
This is the main system of the Cognitive Decision System. This project is still ongoing development so it would not be functional in other laptop for now.
The whole instruction will be provided later in the future

There are some notices you should know:
_2 SQL files: CognitiveSchema for the database schema of this solution and DummyDatatables for the CognitiveAPI repository
_Other files are accidentally updated so no need to worry about them.

# Core Classes and Views
There are a lot of things in this MVC project. Here are details if you want to take a look at these classes:
  1. **Controllers**
    - AdminControllers: Main controller to direct Views for Admin containing : UserInformation, SessionInformation and DashboardInformation.
    - FunctionsController: Containing functions that helps in tracking mouse movements, generating recommendations.
    - RegularUserController: Containing functions that will help in logging into the system, registering, dashboards and widgets activities
    - SystemController: Contains functions that returns the dashboard's interface. 3 default dashboards are included inside: DecisionSummary_Update_Page, SupplierPerformance, Induction_Page_Update. The rest of the functions are to display custom dashboards which will show custom widgets created by users. Unfortunately, we are not able to fully develop this function so it is not functional now.
  2. **DAL** 
    - The only class in this DAL folder is CognitiveSystemDBContext. This context class helps in getting data from the database by using an object created from this class. In this way, we can specify for each controller a context object to allow access into the database. 
  3. **Data Files**
    - This folder contains text file with html tag for the default widgets provided by the client. They are used in Supplier Performance page.
  4. **Scripts**
    There are lots of scripts in this folder. However, most of them are scripts from frameworks. What we would suggest is to follow these listed scripts below since they contain most of the functionalities:
    - create-widget.js: This script contains important functions used in BI service in the CreateWidget View. More details are inside the scripts.
    - /js/SupplierPerformance/AdjustLocation.js: Important script for rearranging the default dashboard (Supplier Performance) based on the recommendations returned from the matlab function.
    - /Mouse tracking/smt-record.js: Slightly changes inside this script compared to the original. The change is to have the number of tag id to be the same with the mouse coordinates. It is a complicated to explain on this text document. I will discuss more about this later.
  5. **Views**
    In Views Folder, there are more sub-folders that contain Views for each controller.
    - Admin Folder
    - RegularUser Folder
    - Shared Folder: contains layout template to be used by other Views
    - System Folder
