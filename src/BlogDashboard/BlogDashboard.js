import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Header from '../Home/Header';
// import Header2 from '../Home/Header2';
import Footer2 from '../Home/Footer2';
import { API_BASE_URL } from '../config';

const BlogDashboard = () => {
  const [form, setForm] = useState({
    titleEn: '',
    titleFr: '',
    titleEs: '',
    descriptionEn: '',
    descriptionFr: '',
    descriptionEs: '',
    tags: '',
    category: '',
    image: null,
  });

  const [news, setNews] = useState([]);

  const fetchNews = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/blogs`);
    setNews(res.data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = e => {
    setForm(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('titleEn', form.titleEn);
    data.append('titleFr', form.titleFr);
    data.append('titleEs', form.titleEs);
    data.append('descriptionEn', form.descriptionEn);
    data.append('descriptionFr', form.descriptionFr);
    data.append('descriptionEs', form.descriptionEs);
    data.append('tags', form.tags);
    data.append('category', form.category);
    data.append('image', form.image);

    await axios.post(`${API_BASE_URL}/api/blogs/add`, data);
    fetchNews();
    setForm({ 
      titleEn: '', titleFr: '', titleEs: '',
      descriptionEn: '', descriptionFr: '', descriptionEs: '',
      tags: '', category: '', image: null 
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE_URL}/api/blogs/${id}`);
    fetchNews();
  };

  // ✂️ Truncate words helper function
  const truncateWords = (text, wordLimit) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '...'
      : text;
  };

  return (
    <>
      <Header />
      <div id="yytr" className="dashboard">
        <h2 id="hd1">Post Blog</h2>
        <form id="fdn1" onSubmit={handleSubmit} encType="multipart/form-data">
          <h3 id="tit">Title</h3>
          <input type="text" name="titleEn" placeholder="Title (English)" onChange={handleChange} value={form.titleEn} required />
          <input type="text" name="titleFr" placeholder="Title (Français)" onChange={handleChange} value={form.titleFr} required />
          <input type="text" name="titleEs" placeholder="Title (Español)" onChange={handleChange} value={form.titleEs} required />
          
          <div id="diss">
            <h3>Description</h3>
            <textarea name="descriptionEn" placeholder="Description (English)" onChange={handleChange} value={form.descriptionEn} required></textarea>
            <textarea name="descriptionFr" placeholder="Description (Français)" onChange={handleChange} value={form.descriptionFr} required></textarea>
            <textarea name="descriptionEs" placeholder="Description (Español)" onChange={handleChange} value={form.descriptionEs} required></textarea>
          </div>

          <input type="text" name="tags" placeholder="Tags (comma separated)" onChange={handleChange} value={form.tags} />
          <input type="text" name="category" placeholder="Category" onChange={handleChange} value={form.category} />
          <input type="file" name="image" onChange={handleFile} required />
          <button type="submit">Submit</button>
        </form>

        <hr />

        <h3 id="hd1">All Blogs</h3>
        <div className="news-cards">
          {news.map(item => (
            <div key={item._id} className="card">
              <img src={item.imageUrl} alt="news" />
              <h4>{item.title}</h4>
              <p>{truncateWords(item.description, 10)}</p>
              <div>
                {item.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
              <small>{item.category}</small>
              <br />
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default BlogDashboard;
