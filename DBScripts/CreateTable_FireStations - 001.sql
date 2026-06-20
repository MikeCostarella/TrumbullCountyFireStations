-- T-SQL script to drop and recreate FireStations table
-- Source: Trumbull County Fire Stations

IF OBJECT_ID('dbo.FireStations', 'U') IS NOT NULL
    DROP TABLE dbo.FireStations;
GO

CREATE TABLE dbo.FireStations (
    Id                  UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Department          NVARCHAR(100)    NOT NULL,
    Station             NVARCHAR(100)    NOT NULL,
    Address             NVARCHAR(150)    NOT NULL,
    City                NVARCHAR(50)     NOT NULL,
    JurisdictionType    NVARCHAR(50)     NOT NULL,
    State               CHAR(2)          NOT NULL,
    ZipCode             VARCHAR(10)      NOT NULL
);
GO

INSERT INTO dbo.FireStations (Id, Department, Station, Address, City, JurisdictionType, State, ZipCode) VALUES
('51f0d278-2057-404e-83f9-a3e7453edc5e', 'Bazetta Township Fire Department', 'Station 11', '773 Everett Hull Road', 'Cortland', 'Township', 'OH', '44410'),
('c29b1487-cf30-473b-b59c-bed0c3d26d35', 'Bazetta Township Fire Department', 'Station 13', '2872 McCleary Jacoby Road', 'Cortland', 'Township', 'OH', '44410'),
('8e977c13-890c-41ea-9db3-cee4e900e60a', 'Bloomfield Township Fire Department', 'Main Station', '8870 Park Avenue', 'North Bloomfield', 'Township', 'OH', '44450'),
('1b46daab-a3d7-4b37-a77b-97175a4ca2f0', 'Bloomfield Township Volunteer Fire Department', 'Station 15', '8832 Park Drive', 'Orwell', 'Township', 'OH', '44076'),
('00f0e42d-0225-45cf-9484-c58fc8e5c58d', 'Braceville Township Fire Department', 'Station A', '800 Newton Falls Braceville Road', 'Newton Falls', 'Township', 'OH', '44444'),
('efc567f4-97b6-4dda-b239-82fd1176c14b', 'Braceville Township Fire Department', 'Station B', '582 Newton Falls Braceville Road', 'Newton Falls', 'Township', 'OH', '44444'),
('e42bca68-166d-45c3-a537-65e164a09ce3', 'Bristol Fire Department', 'Main Station', '1864 Greenville Road NW', 'Bristolville', 'Township', 'OH', '44402'),
('e8902de3-585a-4323-b235-9f9e6992262e', 'Brookfield Township Fire Department', 'Station 18', '774 Ohio 7', 'Brookfield Center', 'Township', 'OH', '44403'),
('2b860ec9-c150-4ce7-91f0-239d4528988d', 'Burghill-Vernon Volunteer Fire Department', 'Station 19', '6915 Ohio 88', 'Kinsman', 'Township', 'OH', '44428'),
('cbefdce6-94b7-4032-8a8b-b0a8467b8967', 'Champion Township Fire Department', 'Main Station', '5759 Mahoning Avenue NW', 'Warren', 'Township', 'OH', '44483'),
('360f77c1-6308-419e-9f2a-b5d546913b91', 'Cortland City Fire Department', 'Main Station', '400 N High Street', 'Cortland', 'City', 'OH', '44410'),
('0980b948-4bde-4eac-bec6-04d8e23f2978', 'Eagle Joint Fire District (Newton Falls)', 'Main Station', '52 Quarry Street', 'Newton Falls', 'Joint District', 'OH', '44444'),
('1c0cc671-fab4-4580-aab3-c7ef277a2232', 'Farmington Township Volunteer Fire Department', 'Main Station', 'State Route 534', 'Farmington', 'Township', 'OH', '44491'),
('8604fe9e-7fb2-453a-a1bf-8ce78a627256', 'Fowler Township Fire Department (Hartford)', 'Main Station', '6959 Ohio 305', 'Fowler', 'Township', 'OH', '44418'),
('280b6cc7-a3eb-4e49-9f32-f8d8e2825cfe', 'Girard Fire Department', 'Main Station', '100 W Main Street', 'Girard', 'City', 'OH', '44420'),
('c8bd4638-0b93-4266-93e2-6b65d0b0fd58', 'Greene Township Volunteer Fire Department', 'Main Station', '5500 Hoagland Blackstub Road', 'Cortland', 'Township', 'OH', '44410'),
('18e6d927-9307-46f8-9581-c526ac366372', 'Gustavus Volunteer Fire Department', 'Main Station', '4030 Route 87', 'Gustavus', 'Township', 'OH', '44491'),
('79df7134-456c-4956-af55-6a0d9f0d4dbc', 'Hartford Township Volunteer Fire Department', 'Main Station', '6959 Ohio 305', 'Fowler', 'Township', 'OH', '44418'),
('90cd5fcc-338e-430f-97ac-0312e1bfe177', 'Howland Township Fire Department', 'Station 30', '169 Niles Cortland Road NE', 'Warren', 'Township', 'OH', '44484'),
('568788be-5b2d-4d0b-963a-b81518db9cab', 'Howland Township Fire Department', 'Station 31', '3403 Ridge Road', 'Warren', 'Township', 'OH', '44484'),
('33b27689-14ce-4b02-8670-6d4d03d7defb', 'Howland Township Fire Department', 'Station 32', '2180 Wilson Avenue NE', 'Warren', 'Township', 'OH', '44484'),
('3436da4e-5dc1-4808-9acd-9a7308281803', 'Hubbard Volunteer Fire Department', 'Main Station', '33 W Liberty Street', 'Hubbard', 'City', 'OH', '44425'),
('b9594d5e-146d-484e-973d-3699f11ee050', 'Johnston Volunteer Fire Department', 'Station 29', '4424 Greenville Road NE', 'Farmdale', 'Township', 'OH', '44417'),
('5f89c58b-1bf4-4fc6-a3e4-caaa2e6dc3e0', 'Kinsman Volunteer Fire Department', 'Main Station', '8450 Ridge Road', 'Kinsman', 'Township', 'OH', '44428'),
('e921233e-f58a-4a71-846d-4ed36212a0d4', 'Liberty Township Fire Department', 'Station 2', '5920 Belmont Avenue', 'Youngstown', 'Township', 'OH', '44505'),
('1fe2de33-de02-4a54-92cc-e9276fc00b1d', 'Liberty Township Fire Department', 'Station 35', '4001 Logan Way', 'Youngstown', 'Township', 'OH', '44505'),
('8187ae27-163b-419d-b425-f334447fb2c9', 'Lordstown Village Fire Department', 'Main Station', '1595 Salt Springs Road', 'Warren', 'Village', 'OH', '44481'),
('7cd25c20-ece5-45dd-a41f-f7335310cfc5', 'McDonald Fire Department', 'Main Station', '451 Ohio Avenue', 'McDonald', 'Village', 'OH', '44437'),
('c38fb304-000d-4c75-b056-dd34b4f3a00b', 'Mecca Township Volunteer Fire Department', 'Main Station', '1100 State Route 46', 'Cortland', 'Township', 'OH', '44410'),
('d76fc75a-286e-40fa-9624-f173b0d6711a', 'Mesopotamia Fire Department', 'Main Station', '8584 State Route 534', 'Mesopotamia', 'Township', 'OH', '44439'),
('3cc0867f-4529-4baf-9046-34150055e588', 'Newton Falls Joint Fire District', 'Main Station', '52 Quarry Street', 'Newton Falls', 'Joint District', 'OH', '44444'),
('e4c48a6c-ffb2-4576-9263-f8ab169edfe6', 'Niles Fire Department', 'Station 7', '15 East State Street SE', 'Niles', 'City', 'OH', '44446'),
('f1c3e748-cd23-46b2-b9e7-39a53a680117', 'Niles Fire Department', 'Station 8', '1235 Niles Cortland Road', 'Niles', 'City', 'OH', '44446'),
('93078539-fa01-412b-87cc-f6d983dd61f5', 'Orangeville Volunteer Fire Department', 'Main Station', '5985 Orangeville Kinsman Road', 'Orangeville', 'Village', 'OH', '44453'),
('7f2dd991-09e4-46f0-9e2b-e03b6ba13caf', 'Southington Volunteer Fire Department', 'Main Station', '4361 Ohio 305', 'Southington', 'Township', 'OH', '44470'),
('1aa1373d-95e0-40a5-b75b-69285b62995a', 'Vienna Township Fire Department', 'Main Station', '833 Youngstown Kingsville Road', 'Vienna Center', 'Township', 'OH', '44473'),
('5624c57f-13af-48fa-8e7f-8e17421ec673', 'Warren City Fire Department', 'Station 1', '111 South Street SE', 'Warren', 'City', 'OH', '44483'),
('1db17c62-d16b-4242-84fd-991834e295a8', 'Warren City Fire Department', 'Atlantic Street Station', '1600 Atlantic Street NE', 'Warren', 'City', 'OH', '44483'),
('22c35c52-9c77-478b-8233-9e8906d948db', 'Warren City Fire Department', 'Parkman Road Station', '2454 Parkman Road NW', 'Warren', 'City', 'OH', '44485'),
('84346049-a63b-4358-af41-9c7d34a3169e', 'Warren Township Fire Department', 'Station 3', '979 Dover Avenue SW', 'Warren', 'Township', 'OH', '44485'),
('32df2161-2576-4b30-b331-8ed3e49c8edd', 'Warren Township Fire Department', 'Station 47', '4750 West Market Street', 'Leavittsburg', 'Township', 'OH', '44430'),
('10424640-ef8b-4e80-a9cd-ecd524f13e1c', 'Weathersfield Township Fire Rescue', 'Main Station', '1451 Prospect Street', 'Mineral Ridge', 'Township', 'OH', '44440'),
('f151af7e-46ef-4ec0-9067-bbd5c53458f0', 'Weathersfield Township Volunteer Fire Department', 'Station 40 - McKinley Heights', '2229 Gardenland Avenue', 'Niles', 'Township', 'OH', '44446'),
('317b3f2d-7865-44a2-ad9c-40e521ae752c', 'Weathersfield Township Volunteer Fire Department', 'Station 42 - West Park', '1382 West Park Avenue', 'Niles', 'Township', 'OH', '44446'),
('81a74f9d-b1b6-4782-a095-1a7f8d7fa30f', '910th Airlift Wing Fire Department', 'YARS Base', '3976 King Graves Road', 'Vienna', 'Federal/Military', 'OH', '44473');
GO