import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Author from '../../assets/img/author.svg';
import Comment from '../../assets/img/comment.svg';
import Logo from '../../assets/img/logo.svg';
import './style.css';



export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            newsItemsIds:[],
            newsItems:[],
            newsItemsArray:[]
        }

        this._handleGetNewsItems = this._handleGetNewsItems.bind(this);
        this._handleGetNewsItemsDetails = this._handleGetNewsItemsDetails.bind(this);
    }

    componentDidMount(){
        this._handleGetNewsItems();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.newsItemsIds.length === nextState.newsItems.length){
            return true;
        }
        else {
            return false;
        }
    }

    componentDidUpdate(){
        if (this.state.newsItemsArray.length === 0){
            this._handlePopulateNewsItems();
        }
        else{
            return;
        }
    }

    _handleGetNewsItems(){

        const url = " https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";

        axios({
            url:url,
            method: 'get'
        })
        .then( res => {
            this.setState({newsItemsIds: res.data});
            this._handleGetNewsItemsDetails();
            
        })
        .catch( err => {
            console.log(err);
        })

    }

    _handleGetNewsItemsDetails(){
        const newsItems=[];
        const newsItemsIds = this.state.newsItemsIds;
            for (let i=0; i < newsItemsIds.length; i++){
                let itemId = newsItemsIds[i];
                let url = `https://hacker-news.firebaseio.com/v0/item/${itemId.toString()}.json?print=pretty`;
                console.log(url)
    
                axios({
                    url: url,
                    method: 'get'
                })
                .then( res => {
                    console.log(res.data);
                    newsItems.push(res.data);
                    this.setState({newsItems: newsItems})
                })
            };
            // this.setState({ newsItems: newsItems});
            console.log('morning')
            console.log('evening');
            console.log(this.state.newsItems);
            if (newsItems.length === newsItemsIds) {
                console.log('vvvvvvvvvv')
            }
            else {
                console.log('fffffffffff')
            }
             
        // this._handlePopulateNewsItems();


    }

    _handlePopulateNewsItems(){
        console.log('easter!!!')
        const newsItems = this.state.newsItems;
        const newsItemsArray = newsItems.map(item => {
             return (
                        <a href={item.url} className='news_item_link' >
                            <div className='news_item'>
                                <div className='news_header'>
                                    <div className='news_header_title'>{item.title}</div>
                                    <div className='news_header_time'>a year ago</div>
                                </div>
                                <div className='news_url'>
                                    {`(${item.url})`}
                                </div>
                                <div className='news_footer'>
                                    <div className='comments_wrap'>
                                        <div className='author'><img src={Author} />{item.by}</div>
                                        <div className='comments'><img src={Comment}/>{item.descendants}</div>
                                    </div>
                                    <div className='points'>{item.score} points</div>
                                </div>
                            </div>
                        </a>
                       
                    )
        });

        this.setState({newsItemsArray: newsItemsArray});


    }



    render(){
        console.log(this.state.newsItems)
        console.log(this.state.newsItemsArray)
        return(
            <div className='news row'>               
                <div className='news_main_wrap col-md-6'>
                    <div className='search_wrap'>
                        <div className='search'>
                            <input />
                            <span>
                                <FontAwesomeIcon icon ='search'/>
                            </span>
                            
                        </div>
                    </div>
                    <div className='news_main'>
                        {this.state.newsItemsArray}
                    </div>
                </div>
                <div className='header col-md-6'>
                    <div className='header_wrap'>
                        <img src={Logo}/>
                        <div className='header_text'>
                             SEARCH HACKER<br/> NEWS
                        </div>
                    </div>
                </div>
            </div>
        )
    }


}