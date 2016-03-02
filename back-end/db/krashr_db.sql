--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.10
-- Dumped by pg_dump version 9.3.10
-- Started on 2016-03-02 18:06:30 CET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 178 (class 3079 OID 11829)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2067 (class 0 OID 0)
-- Dependencies: 178
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- TOC entry 193 (class 1255 OID 32798)
-- Name: get_current_process_status(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION get_current_process_status(u text) RETURNS refcursor
    LANGUAGE plpgsql
    AS $$DECLARE
	p refcursor := 'current_process_status';
BEGIN
	OPEN p FOR SELECT search_types.type, webpage_status.address, process_list.date, process_status.status FROM search_types, webpage_status, process_list, process_status
	WHERE search_types.id = process_list.search_type AND webpage_status.id = web AND process_list.status = process_status.id AND puser = u AND process_list.status = 1 ORDER BY process DESC LIMIT 1;
	RETURN p;
END;$$;


ALTER FUNCTION public.get_current_process_status(u text) OWNER TO postgres;

--
-- TOC entry 192 (class 1255 OID 32801)
-- Name: get_process_status(integer, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION get_process_status(p integer, u text) RETURNS refcursor
    LANGUAGE plpgsql
    AS $$DECLARE
	s refcursor := 'process_status';
BEGIN
	OPEN s FOR SELECT status FROM process_list WHERE process = p AND puser = u;
	RETURN s;
END;$$;


ALTER FUNCTION public.get_process_status(p integer, u text) OWNER TO postgres;

--
-- TOC entry 191 (class 1255 OID 32803)
-- Name: new_process(text, text, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION new_process(url text, u text, stype integer, s integer) RETURNS refcursor
    LANGUAGE plpgsql
    AS $$DECLARE
	w integer;
	aux integer;
	p refcursor := 'new_process';
BEGIN
	IF EXISTS (SELECT process FROM process_list WHERE puser = u AND status <> 0) THEN
		OPEN p FOR SELECT process FROM process_list WHERE puser = u AND status <> 0;
		RETURN p;
	ELSE
		IF EXISTS (SELECT id FROM webpage_status WHERE address = url) THEN
			SELECT id INTO w FROM webpage_status WHERE address = url;
		ELSE
			INSERT INTO webpage_status (address, visited, last_change) VALUES (url, current_timestamp, current_timestamp);
			SELECT id INTO w FROM webpage_status WHERE address = url;			
		END IF;
		INSERT INTO process_list (search_type, web, date, status, puser) VALUES (stype, w, current_timestamp, s, u) RETURNING process INTO aux;
		OPEN p FOR SELECT process FROM process_list WHERE process = aux;
		RETURN p;
	END IF;
END;$$;


ALTER FUNCTION public.new_process(url text, u text, stype integer, s integer) OWNER TO postgres;

--
-- TOC entry 194 (class 1255 OID 32775)
-- Name: update_process(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION update_process(p integer, stype integer) RETURNS void
    LANGUAGE plpgsql
    AS $$BEGIN
	IF stype = 5 THEN
		UPDATE process_list SET search_type = stype, status = 0 WHERE process = p;
	ELSE
		UPDATE process_list SET search_type = stype WHERE process = p;
	END IF;
END;$$;


ALTER FUNCTION public.update_process(p integer, stype integer) OWNER TO postgres;

--
-- TOC entry 2068 (class 0 OID 0)
-- Dependencies: 194
-- Name: FUNCTION update_process(p integer, stype integer); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION update_process(p integer, stype integer) IS 'Updating process status.';


--
-- TOC entry 195 (class 1255 OID 32800)
-- Name: vulnerability_found(integer, integer, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION vulnerability_found(p integer, v integer, w text) RETURNS void
    LANGUAGE plpgsql
    AS $$DECLARE
	i integer;
BEGIN
	SELECT id INTO i FROM webpage_status WHERE address = w;
	IF i IS NULL THEN
		INSERT INTO webpage_status (address, visited, last_change) VALUES (w, current_timestamp, current_timestamp);
		SELECT id INTO i FROM webpage_status WHERE address = w;
	END IF;
	INSERT INTO vulnerabilities (process, web, vulnerability_type, date) VALUES (p, i, v, current_timestamp);
END;$$;


ALTER FUNCTION public.vulnerability_found(p integer, v integer, w text) OWNER TO postgres;

--
-- TOC entry 174 (class 1259 OID 16419)
-- Name: process_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE process_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.process_sequence OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 171 (class 1259 OID 16396)
-- Name: process_list; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE process_list (
    process integer DEFAULT nextval('process_sequence'::regclass) NOT NULL,
    search_type integer NOT NULL,
    web integer,
    date date,
    status integer,
    puser text
);


ALTER TABLE public.process_list OWNER TO postgres;

--
-- TOC entry 177 (class 1259 OID 32838)
-- Name: process_status; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE process_status (
    id integer NOT NULL,
    status text
);


ALTER TABLE public.process_status OWNER TO postgres;

--
-- TOC entry 172 (class 1259 OID 16404)
-- Name: search_types; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE search_types (
    id integer NOT NULL,
    type text COLLATE pg_catalog."es_ES.utf8" NOT NULL
);


ALTER TABLE public.search_types OWNER TO postgres;

--
-- TOC entry 175 (class 1259 OID 24576)
-- Name: vulnerabilities; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE vulnerabilities (
    process integer NOT NULL,
    web integer NOT NULL,
    vulnerability_type integer,
    date date
);


ALTER TABLE public.vulnerabilities OWNER TO postgres;

--
-- TOC entry 173 (class 1259 OID 16409)
-- Name: vunerability_types; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE vunerability_types (
    id integer NOT NULL,
    type text COLLATE pg_catalog."es_ES.utf8" NOT NULL
);


ALTER TABLE public.vunerability_types OWNER TO postgres;

--
-- TOC entry 176 (class 1259 OID 32781)
-- Name: webpage_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE webpage_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.webpage_sequence OWNER TO postgres;

--
-- TOC entry 170 (class 1259 OID 16388)
-- Name: webpage_status; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE webpage_status (
    id integer DEFAULT nextval('webpage_sequence'::regclass) NOT NULL,
    name text,
    address text NOT NULL,
    visited date NOT NULL,
    last_change date NOT NULL
);


ALTER TABLE public.webpage_status OWNER TO postgres;

--
-- TOC entry 1944 (class 2606 OID 24580)
-- Name: PK; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY vulnerabilities
    ADD CONSTRAINT "PK" PRIMARY KEY (process, web);


--
-- TOC entry 1938 (class 2606 OID 16403)
-- Name: PK_process; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY process_list
    ADD CONSTRAINT "PK_process" PRIMARY KEY (process);


--
-- TOC entry 1940 (class 2606 OID 16408)
-- Name: PK_search_types; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY search_types
    ADD CONSTRAINT "PK_search_types" PRIMARY KEY (id);


--
-- TOC entry 1942 (class 2606 OID 16413)
-- Name: PK_vunerability_types; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY vunerability_types
    ADD CONSTRAINT "PK_vunerability_types" PRIMARY KEY (id);


--
-- TOC entry 1936 (class 2606 OID 16392)
-- Name: id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY webpage_status
    ADD CONSTRAINT id PRIMARY KEY (id);


--
-- TOC entry 1946 (class 2606 OID 32845)
-- Name: status_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY process_status
    ADD CONSTRAINT status_pk PRIMARY KEY (id);


--
-- TOC entry 1950 (class 2606 OID 24581)
-- Name: FK_process; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY vulnerabilities
    ADD CONSTRAINT "FK_process" FOREIGN KEY (process) REFERENCES process_list(process);


--
-- TOC entry 1947 (class 2606 OID 16414)
-- Name: FK_search_types; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY process_list
    ADD CONSTRAINT "FK_search_types" FOREIGN KEY (search_type) REFERENCES search_types(id);


--
-- TOC entry 1949 (class 2606 OID 32847)
-- Name: FK_status; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY process_list
    ADD CONSTRAINT "FK_status" FOREIGN KEY (status) REFERENCES process_status(id);


--
-- TOC entry 1952 (class 2606 OID 24591)
-- Name: FK_vultypes; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY vulnerabilities
    ADD CONSTRAINT "FK_vultypes" FOREIGN KEY (vulnerability_type) REFERENCES vunerability_types(id);


--
-- TOC entry 1951 (class 2606 OID 24586)
-- Name: FK_web; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY vulnerabilities
    ADD CONSTRAINT "FK_web" FOREIGN KEY (web) REFERENCES webpage_status(id);


--
-- TOC entry 1948 (class 2606 OID 24596)
-- Name: FK_webpage; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY process_list
    ADD CONSTRAINT "FK_webpage" FOREIGN KEY (web) REFERENCES webpage_status(id);


--
-- TOC entry 2066 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2016-03-02 18:06:30 CET

--
-- PostgreSQL database dump complete
--

