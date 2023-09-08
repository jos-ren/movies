"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Layout, Table, message, Input, Button, Tag, Carousel, Tabs, InputNumber, Space, Tooltip } from 'antd';
const { Search } = Input;
import { StarTwoTone, StarOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, EyeOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
import { FaRegBookmark } from "react-icons/fa6";
import Highlighter from 'react-highlight-words';
import { genreCodes } from "../../public/genres.js"

// option to rate movies in your list
// toggle for list / grid view
// tab for (watched, to watch, favs)
// *add* movie button which changes to *added* once clicked
// prevent from adding an already added
// tv show what episode you are on
// top tab bar
// search titles from my movies
// suycces message when adding movies
// add breakpoints for grid 
// skeleton for grid when searching
// hide poster button
// a section which tells you when a tracked show's new season will come out
// turn major stuff into components
// genre column
// editable cells? (in table component ant design)
// make title filter inline with column name



// const onChange = (pagination, filters, sorter, extra) => {
//   console.log('params', pagination, filters, sorter, extra);
// };
const onChange = (key) => {
  console.log(key);
};
const ImageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`
}

export default function Home() {
  const fetch = require("node-fetch");
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState([]);
  const [selected, setSelected] = useState([]);
  const [disableClear, setDisableClear] = useState(true);
  const [disableRemove, setDisableRemove] = useState(true);
  const [popularMovies, setPopularMovies] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // console.log(tvGenres.genres)
  console.log(movies)

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 95,
            }}
          >
            Filter
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 95,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const movieColumns = [
    {
      title: 'Poster',
      dataIndex: 'poster',
      render: (poster, title) => <Image
        loader={ImageLoader}
        src={poster}
        width={50}
        height={75}
        style={{ objectFit: "cover" }}
        alt={title}
      />,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Audience Rating',
      dataIndex: 'audience_rating',
      sorter: (a, b) => a.audience_rating - b.audience_rating,
      // render: (audience_rating) => <Rate disabled defaultValue={audience_rating} count={10}/>
      render: (audience_rating) => <>
        <StarTwoTone twoToneColor="#fadb14" />
        <> </>
        {Number.parseFloat(audience_rating).toFixed(1)}
      </>
    },
    {
      title: 'Release Date',
      dataIndex: 'release_date',
      sorter: (a, b) => new Date(b.release_date) - new Date(a.release_date),
      render: (release_date) => {
        const date = new Date(release_date)
        return <div>{date.toLocaleDateString('en-US', { dateStyle: "medium", })}</div>
      },
    },
    {
      title: 'Type',
      dataIndex: 'media_type',
      filters: [
        {
          text: 'Movie',
          value: 'movie',
        },
        {
          text: 'TV',
          value: 'tv',
        },
        {
          text: 'Anime',
          value: 'anime',
        },
      ],
      onFilter: (value, record) => record.media_type.indexOf(value) === 0,
      // render: (media_type) => media_type.charAt(0).toUpperCase() + media_type.slice(1)
      render: (media_type) => {
        let color = ""
        if (media_type === "anime") {
          color = "geekblue"
        } else if (media_type === "tv") {
          color = "green"
        } else {
          color = "volcano"
        }
        return (
          <Tag color={color}>
            {media_type.toUpperCase()}
          </Tag>
        )
      }
    },
    {
      title: 'Progress',
      render: (data) => {
        // console.log(data.season, "DATA")
        return data.media_type !== "movie" ? <div>
          {/* perhaps include an edit buitton to edit this data */}
          {/* have an option for Completed */}
          <InputNumber min={1} addonBefore="S" size="small" defaultValue={data.season} onChange={
            (test) => {
              console.log(test)
            }
          } style={{ maxWidth: "80px" }} controls={false} />
          <InputNumber min={1} addonBefore="E" size="small" defaultValue={data.episode} onChange={onChange} style={{ maxWidth: "80px" }} controls={false} />
        </div> : <></>
      },
    },
    {
      title: 'My Rating',
      dataIndex: 'my_rating',
      sorter: (a, b) => a.my_rating - b.my_rating,
      render: (my_rating) => {
        return my_rating !== "unrated" ? <>
          <StarTwoTone twoToneColor="#fadb14" />
          <> </>
          {Number.parseFloat(my_rating).toFixed(1)}
        </> : <StarOutlined />
      }
    },

    // instead of checking what genre is everytime, set the genres when adding to your local storage

    {
      title: 'Genres',
      dataIndex: 'genres',
      render: (genres) => {
        let nameArr = []
        let emojiArr = []

        genres.map((i) => {
          genreCodes.forEach(myFunction)
          function myFunction(i2) {
            if (i === i2.id) {
              nameArr.push(i2.name)
              emojiArr.push(i2.emoji)
            }
          }
        })
        // console.log(arr, "ARR")
        // add a tooltip to the emoji

        console.log(nameArr, "TES")
        return <div style={{display:"flex"}}>
          {nameArr.map((i, index) =>
            <div style={{ marginRight:"3px", cursor: "default", border: "1px solid #d9d9d9", width: "22px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa", borderRadius: "5px" }}>
              <Tooltip title={i}>
                {emojiArr[index]}
              </Tooltip>
            </div>
          )}
        </div>


      },
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    // },
  ];

  const onSuccess = (message) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const onSearch = (value) => {
    fetch("https://api.themoviedb.org/3/search/multi?&language=en-US&query=" + value + "&page=1&include_adult=false", options)
      .then((res) => res.json())
      .then((json) => setSearch(json))
      .catch((err) => console.error("error:" + err));
    setDisableClear(false)
  };

  const clearSearch = () => {
    setSearch([])
    setDisableClear(true)
    // onSuccess('Cleared Search Results');
  };

  const onRemove = () => {
    setMovies(movies.filter(item => !selected.includes(item.key)));
    localStorage.setItem("movies", JSON.stringify(movies.filter(item => !selected.includes(item.key))));
    onSuccess('Successfully Removed ' + selected.length + ' Movies');
    setDisableRemove(true)
  };

  // const url = "https://api.themoviedb.org/3/find/tt14998742?external_source=imdb_id";

  const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
    },
  };

  useEffect(() => {
    const localMovies = JSON.parse(localStorage.getItem("movies"));
    if (localMovies) {
      setMovies(localMovies);
    }

    // fetch top movies
    fetch("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc", options)
      .then((res) => res.json())
      .then((json) => setPopularMovies(json))
      .catch((err) => console.error("error:" + err));
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelected(selectedRowKeys)
      selectedRows.length !== 0 ? setDisableRemove(false) : setDisableRemove(true)
    }
  };

  const tabItems = [
    {
      key: '1',
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <EyeOutlined style={{ marginRight: "7px" }} />
          {/* <CheckOutlined  style={{marginRight:"7px"}}/>   */}
          <div>Seen</div>
        </span>
      ),
      children: <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2>My Movies List</h2>
          <div>
            {/* <Button
              type="primary"
            // onClick={onRemove}
            // disabled={disableRemove}
            >
              Show Posters
            </Button> */}
            <> </>
            <Button
              type="primary"
              danger
              onClick={onRemove}
              disabled={disableRemove}
              icon={<DeleteOutlined />}
            >
              Remove Selected
            </Button>
          </div>
        </div>
        <Table
          style={{ border: '1px solid #ede9e8', borderRadius: "6px" }}
          // bordered
          // onChange={onChange}
          columns={movieColumns}
          dataSource={movies}
          pagination={{ position: ["bottomCenter"], showSizeChanger: true }}
          rowSelection={rowSelection}
        // tableLayout={"auto"}
        />
      </>,
    },
    {
      key: '2',
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaRegBookmark />
          <div style={{ marginLeft: "6px" }}>Watchlist</div>
        </span>
      ),
      children: 'Content of Tab Pane 2',
    },
  ];

  return (
    <>
      {contextHolder}
      {/* {popularMovies.results ? <Carousel 
      // autoplay
      >
        {popularMovies.results.map((o) =>
          <div style={{position:"relative", objectFit: 'cover'}}>
            <Image quality="100" 
            // fill={true} 
            height={200}
            width={900}
            style={{objectFit:"cover"}}
            src={"https://image.tmdb.org/t/p/original" + o.backdrop_path} alt={o.title} />
            <h3 style={contentStyle}>{o.title}</h3>
          </div>
        )}
      </Carousel> : <></>} */}
      <h1>Search</h1>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Search
          size="large"
          placeholder="movie name"
          enterButton="Search"
          onSearch={onSearch}
        />
        <Button
          type="link"
          onClick={clearSearch}
          style={{ marginLeft: "10px", height: "40px" }}
          disabled={disableClear}
        >
          Clear Results
        </Button>
      </div>

      {search.results ?
        <div style={{
          // display: "flex", flexWrap: 'wrap', gap: '20px'
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          // gridTemplateRows: "repeat(2, 1fr)",
          gridColumnGap: "10px",
          gridRowGap: "10px",
          margin: "20px 0px"
        }}>
          {search.results.map((o) => o.media_type !== "people" && o.poster_path ?
            // only show movies with posters && not an actor in search results
            <div
              key={o.id}
              style={{ border: "1px solid red", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <Image height="200" width="125" quality="100" src={"https://image.tmdb.org/t/p/original/" + o.poster_path} alt={o.id} />
              <div >{o.media_type === "movie" ? o.title : o.name}</div>
              <div>
                <Button type="default"
                  onClick={() => {
                    // make anime type if original lang is japanese
                    let type = o.original_language === "ja" ? "anime" : o.media_type;
                    // if tv or movie some fields will be different (title, release date)
                    let release = o.media_type === "movie" ? o.release_date : o.first_air_date;
                    let title = o.media_type === "movie" ? o.title : o.name;

                    setMovies([...movies, {
                      key: o.id,
                      title: title,
                      poster: "https://image.tmdb.org/t/p/original/" + o.poster_path,
                      audience_rating: o.vote_average,
                      release_date: release,
                      media_type: type,
                      genres: o.genre_ids,
                      season: "1",
                      episode: "1",
                      my_rating: "unrated"
                    }]);
                    localStorage.setItem("movies", JSON.stringify([...movies, {
                      key: o.id,
                      title: title,
                      poster: "https://image.tmdb.org/t/p/original/" + o.poster_path,
                      audience_rating: o.vote_average,
                      release_date: release,
                      media_type: type,
                      genres: o.genre_ids,
                      season: "1",
                      episode: "1",
                      my_rating: "unrated"
                    }]));
                    onSuccess('Added ' + title + ' to My Movies');
                  }}
                >Add to List</Button>
                {/* <Button type="default" shape="circle" icon={<HeartOutlined />} /> */}
              </div>
            </div>
            : null)}
        </div> : null}
      <br />
      <br />
      <br />

      <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange} size={"large"} centered />
    </>
  );
}
