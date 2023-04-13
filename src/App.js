import React, {useState , useEffect,useCallback} from 'react';
import AddMovie from './components/AddMovie';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const[movies, setMovies]= useState([]);
  const [isLoading , setIsLoading]= useState(false);
  const[error, setError]= useState(false);

 
  // const dummyMovies = [
  //   {
  //     id: 1,
  //     title: 'Some Dummy Movie',
  //     openingText: 'This is the opening text of the movie',
  //     releaseDate: '2021-05-18',
  //   },
  //   {
  //     id: 2,
  //     title: 'Some Dummy Movie 2',
  //     openingText: 'This is the second opening text of the movie',
  //     releaseDate: '2021-05-19',
  //   },
  // ];
 //fetch returna promise thn react to response 
 //seding a req is ascryns taks so handling the response send back in json format  
 /*
 //using promise 

 function  fetchMovieHandler(){
    fetch('https://swapi.dev/api/films/').then(response =>{
        return  response.json(); //return promise json change json into js obj 
    }).then(data=>{
      //have to tranform key apis -> self prj ket like in api there name differnet nd we have to convert into our sutiable name 
      const transFormedMovies = data.results.map(movieData =>{

        return {
          id:movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releasedDate : movieData.release_date,
        };
      })
     setMovies( transFormedMovies); //using for the movie list 
    }); //fetch(url , additn msh it may be default get )
  }
  */
//why callback to avoid infinte loop nd bugs 
//chnging async fnction to 
  const fetchMovieHandler = useCallback(async ()=>{
    setIsLoading(true);
    setError(null);
    try{//this is rquest sending to firebase at last .json is imp 
      // const response = await fetch('https://swapi.dev/api/films/');
     const response = await fetch('https://filmspot-86bf8-default-rtdb.firebaseio.com/movies.json')
   if(!response.ok){
    throw new Error('something went wrong');
   }
   const data = await response.json(); 
   const loadedMovies= [];
    for(const key in data){
      loadedMovies.push({
        id: key,
        title: data[key].title,
        openingText : data[key].openingText,
        realeaseDate: data[key].releaseDate,
      });
    }

   
   //sync taks-->uses try nd catch, used in get the rep
   /* 
   const transFormedMovies = data.results.map((movieData) =>{
        return {
          id:movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releasedDate : movieData.release_date,
        };
      }); */
     setMovies( loadedMovies); //using for the movie list

    }
    catch(error){
//as this dummy api cant give the real error axios can give
      setError(error.message);
    }
    setIsLoading(false);
   
    
    } ,[]);//fetch(url , additn msh it may be default get )


    useEffect(()=>{
      fetchMovieHandler();//showing dar after user visit ui  list directy whn wn
    },[fetchMovieHandler]);

    async function addMovieHandler(movie) {
      // console.log(movie);
      //whenever ther is asyn so promise called 
      const response = await fetch('https://filmspot-86bf8-default-rtdb.firebaseio.com/movies.json',{
        method :'POST',
        body:JSON.stringify(movie),//javascrit obj to json 
        headers:{
          'content-Type': 'application/json',
        }
      });
      const data= await response.json();
      console.log(data);
    }

    let content = <p>Found no movies</p>;
    if(movies.length>0){
      content = <MoviesList movies= {movies} />
    }
    if(error){
      content = <p>{error}</p>
    }
    if(isLoading){
      content = <p>Loading...</p>
    }

  return (
    <React.Fragment>
     <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick = {fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
      {content}
       {/* { !isLoading && movies.length >0 && <MoviesList movies={movies} />}
       {!isLoading && movies.length===0 &&!error && <p>Found no movies</p>}
       {isLoading && <p>Loading..</p>}
       {!isLoading && error &&<p>{error}</p> } */}
      </section>
    </React.Fragment>
  );
}

export default App;


//we are using swapi ->backened app  to send the http request to get the daata back nd its store 
//js libary ->axios 
//fetch api ->send request nd work on response  here we usinf this this in order to fetch movie nd gets  list 

//this is way to use the http request to bacened inside the react app 
//have to tell user which state is yr user is currently loading not found o
//use callback nd useelssect use dependency 
//using useellsct nd callbak loads the movies immediatly when we are in ui without button click