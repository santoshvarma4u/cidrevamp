pg_dump: last built-in OID is 16383
pg_dump: reading extensions
pg_dump: identifying extension members
pg_dump: reading schemas
pg_dump: reading user-defined tables
pg_dump: reading user-defined functions
pg_dump: reading user-defined types
pg_dump: reading procedural languages
pg_dump: reading user-defined aggregate functions
pg_dump: reading user-defined operators
pg_dump: reading user-defined access methods
pg_dump: reading user-defined operator classes
pg_dump: reading user-defined operator families
pg_dump: reading user-defined text search parsers
pg_dump: reading user-defined text search templates
pg_dump: reading user-defined text search dictionaries
pg_dump: reading user-defined text search configurations
pg_dump: reading user-defined foreign-data wrappers
pg_dump: reading user-defined foreign servers
pg_dump: reading default privileges
pg_dump: reading user-defined collations
pg_dump: reading user-defined conversions
pg_dump: reading type casts
pg_dump: reading transforms
pg_dump: reading table inheritance information
pg_dump: reading event triggers
pg_dump: finding extension tables
pg_dump: finding inheritance relationships
pg_dump: reading column info for interesting tables
pg_dump: finding table default expressions
pg_dump: flagging inherited columns in subtables
pg_dump: reading partitioning data
pg_dump: reading indexes
pg_dump: flagging indexes in partitioned tables
pg_dump: reading extended statistics
pg_dump: reading constraints
pg_dump: reading triggers
pg_dump: reading rewrite rules
pg_dump: reading policies
pg_dump: reading row-level security policies
pg_dump: reading publications
pg_dump: reading publication membership of tables
pg_dump: reading publication membership of schemas
pg_dump: reading subscriptions
pg_dump: reading large objects
pg_dump: reading dependency data
pg_dump: saving encoding = UTF8
pg_dump: saving standard_conforming_strings = on
pg_dump: saving search_path = 
pg_dump: saving database definition
pg_dump: dropping DATABASE neondb
pg_dump: creating DATABASE "neondb"
pg_dump: connecting to new database "neondb"
pg_dump: creating TABLE "public.complaints"
pg_dump: creating SEQUENCE "public.complaints_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.complaints_id_seq"
pg_dump: creating TABLE "public.menu_items"
pg_dump: creating SEQUENCE "public.menu_items_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.menu_items_id_seq"
pg_dump: creating TABLE "public.news"
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

-- Started on 2025-07-29 13:32:07 UTC

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

DROP DATABASE IF EXISTS neondb;
--
-- TOC entry 3469 (class 1262 OID 16389)
-- Name: neondb; Type: DATABASE; Schema: -; Owner: neondb_owner
--

CREATE DATABASE neondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';


ALTER DATABASE neondb OWNER TO neondb_owner;

\connect neondb

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 24577)
-- Name: complaints; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.complaints (
    id integer NOT NULL,
    complaint_number character varying NOT NULL,
    type character varying NOT NULL,
    subject text NOT NULL,
    description text NOT NULL,
    complainant_name character varying NOT NULL,
    complainant_email character varying,
    complainant_phone character varying,
    complainant_address text,
    status character varying DEFAULT 'pending'::character varying,
    priority character varying DEFAULT 'medium'::character varying,
    assigned_to character varying,
    attachments text[],
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.complaints OWNER TO neondb_owner;

--
-- TOC entry 215 (class 1259 OID 24576)
-- Name: complaints_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.complaints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.complaints_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 215
-- Name: complaints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.complaints_id_seq OWNED BY public.complaints.id;


--
-- TOC entry 218 (class 1259 OID 24592)
-- Name: menu_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    label character varying NOT NULL,
    url character varying,
    parent_id integer,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.menu_items OWNER TO neondb_owner;

--
-- TOC entry 217 (class 1259 OID 24591)
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_items_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3472 (class 0 OID 0)
-- Dependencies: 217
-- Name: menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;


--
-- TOC entry 220 (class 1259 OID 24604)
-- Name: news; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    excerpt text,
    featured_image character varying,
    category character varying DEFAULT 'general'::character varying,
    is_published boolean DEFAULT false,
    is_pinned boolean DEFAULT false,
    author_id character varying,
    publishedpg_dump: creating SEQUENCE "public.news_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.news_id_seq"
pg_dump: creating TABLE "public.pages"
pg_dump: creating SEQUENCE "public.pages_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.pages_id_seq"
pg_dump: creating TABLE "public.photo_album_photos"
pg_dump: creating SEQUENCE "public.photo_album_photos_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.photo_album_photos_id_seq"
pg_dump: creating TABLE "public.photo_albums"
pg_dump: creating SEQUENCE "public.photo_albums_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.photo_albums_id_seq"
pg_dump: creating TABLE "public.photos"
_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.news OWNER TO neondb_owner;

--
-- TOC entry 219 (class 1259 OID 24603)
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 219
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- TOC entry 222 (class 1259 OID 24618)
-- Name: pages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    slug character varying NOT NULL,
    title text NOT NULL,
    content text,
    meta_title character varying,
    meta_description text,
    is_published boolean DEFAULT false,
    author_id character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    show_in_menu boolean DEFAULT false,
    menu_title character varying,
    menu_parent character varying,
    menu_order integer DEFAULT 0,
    menu_description text
);


ALTER TABLE public.pages OWNER TO neondb_owner;

--
-- TOC entry 221 (class 1259 OID 24617)
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pages_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3474 (class 0 OID 0)
-- Dependencies: 221
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


--
-- TOC entry 224 (class 1259 OID 24632)
-- Name: photo_album_photos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.photo_album_photos (
    id integer NOT NULL,
    album_id integer,
    photo_id integer,
    sort_order integer DEFAULT 0
);


ALTER TABLE public.photo_album_photos OWNER TO neondb_owner;

--
-- TOC entry 223 (class 1259 OID 24631)
-- Name: photo_album_photos_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.photo_album_photos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.photo_album_photos_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3475 (class 0 OID 0)
-- Dependencies: 223
-- Name: photo_album_photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.photo_album_photos_id_seq OWNED BY public.photo_album_photos.id;


--
-- TOC entry 226 (class 1259 OID 24640)
-- Name: photo_albums; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.photo_albums (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    cover_photo_id integer,
    is_published boolean DEFAULT false,
    created_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.photo_albums OWNER TO neondb_owner;

--
-- TOC entry 225 (class 1259 OID 24639)
-- Name: photo_albums_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.photo_albums_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.photo_albums_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3476 (class 0 OID 0)
-- Dependencies: 225
-- Name: photo_albums_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.photo_albums_id_seq OWNED BY public.photo_albums.id;


--
-- TOC entry 228 (class 1259 OID 24652)
-- Name: photos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE pubpg_dump: creating SEQUENCE "public.photos_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.photos_id_seq"
pg_dump: creating TABLE "public.sessions"
pg_dump: creating TABLE "public.users"
pg_dump: creating TABLE "public.videos"
pg_dump: creating SEQUENCE "public.videos_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.videos_id_seq"
pg_dump: creating DEFAULT "public.complaints id"
pg_dump: creating DEFAULT "public.menu_items id"
pg_dump: creating DEFAULT "public.news id"
pg_dump: creating DEFAULT "public.pages id"
lic.photos (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    file_name character varying NOT NULL,
    file_path character varying NOT NULL,
    category character varying DEFAULT 'operations'::character varying,
    is_published boolean DEFAULT false,
    uploaded_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.photos OWNER TO neondb_owner;

--
-- TOC entry 227 (class 1259 OID 24651)
-- Name: photos_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.photos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.photos_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 227
-- Name: photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.photos_id_seq OWNED BY public.photos.id;


--
-- TOC entry 229 (class 1259 OID 24664)
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- TOC entry 230 (class 1259 OID 24671)
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    role character varying DEFAULT 'user'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    username character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- TOC entry 232 (class 1259 OID 24686)
-- Name: videos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.videos (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    file_name character varying NOT NULL,
    file_path character varying NOT NULL,
    thumbnail_path character varying,
    duration integer,
    category character varying DEFAULT 'news'::character varying,
    is_published boolean DEFAULT false,
    uploaded_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.videos OWNER TO neondb_owner;

--
-- TOC entry 231 (class 1259 OID 24685)
-- Name: videos_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.videos_id_seq OWNER TO neondb_owner;

--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 231
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.videos_id_seq OWNED BY public.videos.id;


--
-- TOC entry 3223 (class 2604 OID 24580)
-- Name: complaints id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.complaints ALTER COLUMN id SET DEFAULT nextval('public.complaints_id_seq'::regclass);


--
-- TOC entry 3228 (class 2604 OID 24595)
-- Name: menu_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);


--
-- TOC entry 3232 (class 2604 OID 24607)
-- Name: news id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- TOC entry 3238 (class 2604 OID 24621)
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pagpg_dump: creating DEFAULT "public.photo_album_photos id"
pg_dump: creating DEFAULT "public.photo_albums id"
pg_dump: creating DEFAULT "public.photos id"
pg_dump: creating DEFAULT "public.videos id"
pg_dump: processing data for table "public.complaints"
pg_dump: dumping contents of table "public.complaints"
pg_dump: processing data for table "public.menu_items"
pg_dump: dumping contents of table "public.menu_items"
pg_dump: processing data for table "public.news"
pg_dump: dumping contents of table "public.news"
pg_dump: processing data for table "public.pages"
pg_dump: dumping contents of table "public.pages"
pg_dump: processing data for table "public.photo_album_photos"
pg_dump: dumping contents of table "public.photo_album_photos"
pg_dump: processing data for table "public.photo_albums"
pg_dump: dumping contents of table "public.photo_albums"
es_id_seq'::regclass);


--
-- TOC entry 3244 (class 2604 OID 24635)
-- Name: photo_album_photos id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photo_album_photos ALTER COLUMN id SET DEFAULT nextval('public.photo_album_photos_id_seq'::regclass);


--
-- TOC entry 3246 (class 2604 OID 24643)
-- Name: photo_albums id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photo_albums ALTER COLUMN id SET DEFAULT nextval('public.photo_albums_id_seq'::regclass);


--
-- TOC entry 3250 (class 2604 OID 24655)
-- Name: photos id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photos ALTER COLUMN id SET DEFAULT nextval('public.photos_id_seq'::regclass);


--
-- TOC entry 3260 (class 2604 OID 24689)
-- Name: videos id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.videos ALTER COLUMN id SET DEFAULT nextval('public.videos_id_seq'::regclass);


--
-- TOC entry 3447 (class 0 OID 24577)
-- Dependencies: 216
-- Data for Name: complaints; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.complaints (id, complaint_number, type, subject, description, complainant_name, complainant_email, complainant_phone, complainant_address, status, priority, assigned_to, attachments, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3449 (class 0 OID 24592)
-- Dependencies: 218
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.menu_items (id, label, url, parent_id, sort_order, is_active, created_at) FROM stdin;
\.


--
-- TOC entry 3451 (class 0 OID 24604)
-- Dependencies: 220
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.news (id, title, content, excerpt, featured_image, category, is_published, is_pinned, author_id, published_at, created_at, updated_at) FROM stdin;
2	CEIR Tracing	More than Two Thousand (2,000) Lost/missing mobile devices have been traced/ recovered in a short span of less than 2 months from its launch & Handed over to rightful owners by using CEIR (Central Equipment Identity Register) portal by Telangana Police in association with Department of Telecommunication.\n\n		\N	general	t	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-28 21:24:44.807	2025-07-29 02:54:45.356603	2025-07-29 02:54:45.356603
3	Ist Duty Meet Telangana Police	Inauguration of Telangana's 1st Police\n\nDuty Meet by Dr. Jitender IPS @Telangana\n\nDGP at @RBVRR_TGPA, marks  beginning\n\nof a 4-day event featuring various competitions\n\nwith participation from #PoliceOfficers\n\nacross the state. These activities aim to\n\nfoster motivation &&; team spirit!		\N	general	t	f	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-28 21:27:44.358	2025-07-29 02:57:47.265856	2025-07-29 02:57:47.265856
\.


--
-- TOC entry 3453 (class 0 OID 24618)
-- Dependencies: 222
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pages (id, slug, title, content, meta_title, meta_description, is_published, author_id, created_at, updated_at, show_in_menu, menu_title, menu_parent, menu_order, menu_description) FROM stdin;
1	cases	Cases	Show Cases&nbsp;	cases	cases	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-29 11:13:07.051685	2025-07-29 11:13:07.051685	t	Cases	about	0	
2	/media	Media	dsfsdfsd	sfs	sdfsd	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-29 11:59:49.484973	2025-07-29 11:59:55.477	t	Media	media	0	
\.


--
-- TOC entry 3455 (class 0 OID 24632)
-- Dependencies: 224
-- Data for Name: photo_album_photos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.photo_album_photos (id, album_id, photo_id, sort_order) FROM stdin;
\.


--
-- TOC entry 3457 (class 0 OID 24640)
-- Dependencies: 226
-- Data for Name: photo_albums; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.photo_albums (id, name, description, cover_photo_id, is_published, created_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3459 (class 0 OID 24652)
-- Dependencies: 228
-- Data for Npg_dump: processing data for table "public.photos"
pg_dump: dumping contents of table "public.photos"
pg_dump: processing data for table "public.sessions"
pg_dump: dumping contents of table "public.sessions"
pg_dump: processing data for table "public.users"
pg_dump: dumping contents of table "public.users"
pg_dump: processing data for table "public.videos"
pg_dump: dumping contents of table "public.videos"
pg_dump: executing SEQUENCE SET complaints_id_seq
pg_dump: executing SEQUENCE SET menu_items_id_seq
pg_dump: executing SEQUENCE SET news_id_seq
pg_dump: executing SEQUENCE SET pages_id_seq
pg_dump: executing SEQUENCE SET photo_album_photos_id_seq
pg_dump: executing SEQUENCE SET photo_albums_id_seq
pg_dump: executing SEQUENCE SET photos_id_seq
pg_dump: executing SEQUENCE SET videos_id_seq
pg_dump: creating CONSTRAINT "public.complaints complaints_complaint_number_unique"
ame: photos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.photos (id, title, description, file_name, file_path, category, is_published, uploaded_by, created_at, updated_at) FROM stdin;
6	DGP TG Review Meeting		photo-1753757496864-162536897.jpg	uploads/photo-1753757496864-162536897.jpg	events	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-29 02:51:36.887163	2025-07-29 02:51:36.887163
7	DGP TG Review meeting 		photo-1753757521103-840719290.jpg	uploads/photo-1753757521103-840719290.jpg	events	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-29 02:52:01.119228	2025-07-29 02:52:01.119228
9	DGP		photo-1753757571803-286790703.jpg	uploads/photo-1753757571803-286790703.jpg	operations	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-29 02:52:51.819047	2025-07-29 02:52:51.819047
10	CEIR		photo-1753757591798-19011033.jpg	uploads/photo-1753757591798-19011033.jpg	events	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-29 02:53:11.813333	2025-07-29 02:53:11.813333
\.


--
-- TOC entry 3460 (class 0 OID 24664)
-- Dependencies: 229
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (sid, sess, expire) FROM stdin;
\.


--
-- TOC entry 3461 (class 0 OID 24671)
-- Dependencies: 230
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, first_name, last_name, profile_image_url, role, is_active, created_at, updated_at, username, password) FROM stdin;
3ed49eec-6033-4303-aa12-52054303f02a	admin@cid.tspolice.gov.in	System	Administrator	\N	admin	t	2025-07-26 03:32:54.645611	2025-07-26 03:32:54.645611	admin	6dbc45008f58b0b435b39e38d343f2026c5493fe798b5ea504ff2d1c24fe23b578ae4c76876fd5ed54bd8a60f1e37ac5c75a8e9971694e46a78a88fda5accb51.50c867b7674ab5e33862eecd76828168
\.


--
-- TOC entry 3463 (class 0 OID 24686)
-- Dependencies: 232
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.videos (id, title, description, file_name, file_path, thumbnail_path, duration, category, is_published, uploaded_by, created_at, updated_at) FROM stdin;
3	fsdfdsf	sdfsdfds	video-1753790272662-900100215.mp4	uploads/video-1753790272662-900100215.mp4	\N	\N	news	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-29 11:57:55.750853	2025-07-29 11:57:55.750853
\.


--
-- TOC entry 3479 (class 0 OID 0)
-- Dependencies: 215
-- Name: complaints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.complaints_id_seq', 1, false);


--
-- TOC entry 3480 (class 0 OID 0)
-- Dependencies: 217
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 1, false);


--
-- TOC entry 3481 (class 0 OID 0)
-- Dependencies: 219
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.news_id_seq', 3, true);


--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 221
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.pages_id_seq', 2, true);


--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 223
-- Name: photo_album_photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.photo_album_photos_id_seq', 1, false);


--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 225
-- Name: photo_albums_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.photo_albums_id_seq', 1, false);


--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 227
-- Name: photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.photos_id_seq', 10, true);


--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 231
-- Name: videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.videos_id_seq', 3, true);


--
-- TOC entry 3266 (class 2606 OID 24590)
-- Name: complaints complaints_complaint_number_unique; pg_dump: creating CONSTRAINT "public.complaints complaints_pkey"
pg_dump: creating CONSTRAINT "public.menu_items menu_items_pkey"
pg_dump: creating CONSTRAINT "public.news news_pkey"
pg_dump: creating CONSTRAINT "public.pages pages_pkey"
pg_dump: creating CONSTRAINT "public.pages pages_slug_unique"
pg_dump: creating CONSTRAINT "public.photo_album_photos photo_album_photos_pkey"
pg_dump: creating CONSTRAINT "public.photo_albums photo_albums_pkey"
pg_dump: creating CONSTRAINT "public.photos photos_pkey"
pg_dump: creating CONSTRAINT "public.sessions sessions_pkey"
pg_dump: creating CONSTRAINT "public.users users_email_unique"
pg_dump: creating CONSTRAINT "public.users users_pkey"
pg_dump: creating CONSTRAINT "public.users users_username_unique"
pg_dump: creating CONSTRAINT "public.videos videos_pkey"
pg_dump: creating INDEX "public.IDX_session_expire"
pg_dump: creating FK CONSTRAINT "public.complaints complaints_assigned_to_users_id_fk"
pg_dump: creating FK CONSTRAINT "public.news news_author_id_users_id_fk"
pg_dump: creating FK CONSTRAINT "public.pages pages_author_id_users_id_fk"
Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_complaint_number_unique UNIQUE (complaint_number);


--
-- TOC entry 3268 (class 2606 OID 24588)
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- TOC entry 3270 (class 2606 OID 24602)
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3272 (class 2606 OID 24616)
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- TOC entry 3274 (class 2606 OID 24628)
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- TOC entry 3276 (class 2606 OID 24630)
-- Name: pages pages_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_slug_unique UNIQUE (slug);


--
-- TOC entry 3278 (class 2606 OID 24638)
-- Name: photo_album_photos photo_album_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photo_album_photos
    ADD CONSTRAINT photo_album_photos_pkey PRIMARY KEY (id);


--
-- TOC entry 3280 (class 2606 OID 24650)
-- Name: photo_albums photo_albums_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photo_albums
    ADD CONSTRAINT photo_albums_pkey PRIMARY KEY (id);


--
-- TOC entry 3282 (class 2606 OID 24663)
-- Name: photos photos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);


--
-- TOC entry 3285 (class 2606 OID 24670)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- TOC entry 3287 (class 2606 OID 24684)
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- TOC entry 3289 (class 2606 OID 24682)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3291 (class 2606 OID 32769)
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- TOC entry 3293 (class 2606 OID 24697)
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- TOC entry 3283 (class 1259 OID 24743)
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- TOC entry 3294 (class 2606 OID 24698)
-- Name: complaints complaints_assigned_to_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_assigned_to_users_id_fk FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- TOC entry 3295 (class 2606 OID 24703)
-- Name: news news_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- TOC entry 3296 (class 2606 OID 24708)
-- Name: pages pages_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_author_id_users_id_fk FOREIpg_dump: creating FK CONSTRAINT "public.photo_album_photos photo_album_photos_album_id_photo_albums_id_fk"
pg_dump: creating FK CONSTRAINT "public.photo_album_photos photo_album_photos_photo_id_photos_id_fk"
pg_dump: creating FK CONSTRAINT "public.photo_albums photo_albums_cover_photo_id_photos_id_fk"
pg_dump: creating FK CONSTRAINT "public.photo_albums photo_albums_created_by_users_id_fk"
pg_dump: creating FK CONSTRAINT "public.photos photos_uploaded_by_users_id_fk"
pg_dump: creating FK CONSTRAINT "public.videos videos_uploaded_by_users_id_fk"
pg_dump: creating ACL "DATABASE neondb"
pg_dump: creating DEFAULT ACL "public.DEFAULT PRIVILEGES FOR SEQUENCES"
pg_dump: creating DEFAULT ACL "public.DEFAULT PRIVILEGES FOR TABLES"
GN KEY (author_id) REFERENCES public.users(id);


--
-- TOC entry 3297 (class 2606 OID 24713)
-- Name: photo_album_photos photo_album_photos_album_id_photo_albums_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photo_album_photos
    ADD CONSTRAINT photo_album_photos_album_id_photo_albums_id_fk FOREIGN KEY (album_id) REFERENCES public.photo_albums(id);


--
-- TOC entry 3298 (class 2606 OID 24718)
-- Name: photo_album_photos photo_album_photos_photo_id_photos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photo_album_photos
    ADD CONSTRAINT photo_album_photos_photo_id_photos_id_fk FOREIGN KEY (photo_id) REFERENCES public.photos(id);


--
-- TOC entry 3299 (class 2606 OID 24723)
-- Name: photo_albums photo_albums_cover_photo_id_photos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photo_albums
    ADD CONSTRAINT photo_albums_cover_photo_id_photos_id_fk FOREIGN KEY (cover_photo_id) REFERENCES public.photos(id);


--
-- TOC entry 3300 (class 2606 OID 24728)
-- Name: photo_albums photo_albums_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photo_albums
    ADD CONSTRAINT photo_albums_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 3301 (class 2606 OID 24733)
-- Name: photos photos_uploaded_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_uploaded_by_users_id_fk FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- TOC entry 3302 (class 2606 OID 24738)
-- Name: videos videos_uploaded_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_uploaded_by_users_id_fk FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 3469
-- Name: DATABASE neondb; Type: ACL; Schema: -; Owner: neondb_owner
--

GRANT ALL ON DATABASE neondb TO neon_superuser;


--
-- TOC entry 2082 (class 826 OID 16392)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- TOC entry 2081 (class 826 OID 16391)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


-- Completed on 2025-07-29 13:32:12 UTC

--
-- PostgreSQL database dump complete
--

