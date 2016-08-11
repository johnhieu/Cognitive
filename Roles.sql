SET IDENTITY_INSERT [dbo].[Role] ON
INSERT INTO [dbo].[Role] ([RoleId], [RoleName], [RoleDesc]) VALUES (1, N'Novice', N'Newly users who enters the system')
INSERT INTO [dbo].[Role] ([RoleId], [RoleName], [RoleDesc]) VALUES (2, N'Expert', N'Users who have been using the system for a while, know all the features and where to go')
INSERT INTO [dbo].[Role] ([RoleId], [RoleName], [RoleDesc]) VALUES (3, N'Advanced', N'Know the web sites well, can go through all the details')
SET IDENTITY_INSERT [dbo].[Role] OFF
