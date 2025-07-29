--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.users VALUES ('3ed49eec-6033-4303-aa12-52054303f02a', 'admin@cid.tspolice.gov.in', 'System', 'Administrator', NULL, 'admin', true, '2025-07-26 03:32:54.645611', '2025-07-26 03:32:54.645611', 'admin', '6dbc45008f58b0b435b39e38d343f2026c5493fe798b5ea504ff2d1c24fe23b578ae4c76876fd5ed54bd8a60f1e37ac5c75a8e9971694e46a78a88fda5accb51.50c867b7674ab5e33862eecd76828168');


--
-- Data for Name: complaints; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.news VALUES (2, 'CEIR Tracing', 'More than Two Thousand (2,000) Lost/missing mobile devices have been traced/ recovered in a short span of less than 2 months from its launch & Handed over to rightful owners by using CEIR (Central Equipment Identity Register) portal by Telangana Police in association with Department of Telecommunication.

', '', NULL, 'general', true, true, '3ed49eec-6033-4303-aa12-52054303f02a', '2025-07-28 21:24:44.807', '2025-07-29 02:54:45.356603', '2025-07-29 02:54:45.356603');
INSERT INTO public.news VALUES (3, 'Ist Duty Meet Telangana Police', 'Inauguration of Telangana''s 1st Police

Duty Meet by Dr. Jitender IPS @Telangana

DGP at @RBVRR_TGPA, marks  beginning

of a 4-day event featuring various competitions

with participation from #PoliceOfficers

across the state. These activities aim to

foster motivation &&; team spirit!', '', NULL, 'general', true, false, '3ed49eec-6033-4303-aa12-52054303f02a', '2025-07-28 21:27:44.358', '2025-07-29 02:57:47.265856', '2025-07-29 02:57:47.265856');


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.pages VALUES (1, 'cases', 'Cases', 'Show Cases&nbsp;', 'cases', 'cases', true, '3ed49eec-6033-4303-aa12-52054303f02a', '2025-07-29 11:13:07.051685', '2025-07-29 11:13:07.051685', true, 'Cases', 'about', 0, '');
INSERT INTO public.pages VALUES (2, '/media', 'Media', 'dsfsdfsd', 'sfs', 'sdfsd', true, '3ed49eec-6033-4303-aa12-52054303f02a', '2025-07-29 11:59:49.484973', '2025-07-29 11:59:55.477', true, 'Media', 'media', 0, '');


--
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.photos VALUES (6, 'DGP TG Review Meeting', '', 'photo-1753757496864-162536897.jpg', 'uploads/photo-1753757496864-162536897.jpg', 'events', true, '3ed49eec-6033-4303-aa12-52054303f02a', '2025-07-29 02:51:36.887163', '2025-07-29 02:51:36.887163');
INSERT INTO public.photos VALUES (7, 'DGP TG Review meeting ', '', 'photo-1753757521103-840719290.jpg', 'uploads/photo-1753757521103-840719290.jpg', 'events', true, '3ed49eec-6033-4303-aa12-52054303f02a', '2025-07-29 02:52:01.119228', '2025-07-29 02:52:01.119228');
INSERT INTO public.photos VALUES (9, 'DGP', '', 'photo-1753757571803-286790703.jpg', 'uploads/photo-1753757571803-286790703.jpg', 'operations', true, '3ed49eec-6033-4303-aa12-52054303f02a', '2025-07-29 02:52:51.819047', '2025-07-29 02:52:51.819047');
INSERT INTO public.photos VALUES (10, 'CEIR', '', 'photo-1753757591798-19011033.jpg', 'uploads/photo-1753757591798-19011033.jpg', 'events', true, '3ed49eec-6033-4303-aa12-52054303f02a', '2025-07-29 02:53:11.813333', '2025-07-29 02:53:11.813333');


--
-- Data for Name: photo_albums; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: photo_album_photos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.videos VALUES (3, 'fsdfdsf', 'sdfsdfds', 'video-1753790272662-900100215.mp4', 'uploads/video-1753790272662-900100215.mp4', NULL, NULL, 'news', true, '3ed49eec-6033-4303-aa12-52054303f02a', '2025-07-29 11:57:55.750853', '2025-07-29 11:57:55.750853');


--
-- Name: complaints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.complaints_id_seq', 1, false);


--
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 1, false);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.news_id_seq', 3, true);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.pages_id_seq', 2, true);


--
-- Name: photo_album_photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.photo_album_photos_id_seq', 1, false);


--
-- Name: photo_albums_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.photo_albums_id_seq', 1, false);


--
-- Name: photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.photos_id_seq', 10, true);


--
-- Name: videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.videos_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

