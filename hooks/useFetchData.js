const { default: axios } = require("axios");
const { useEffect, useState } = require("react");

function useFetchData(apiEndPoint) {
  const [alldata, setAlldata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchAllData = async () => {
    try {
      const res = await axios.get(apiEndPoint);
      setAlldata(res.data);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Set loading false even if there's an error
    }
  };

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false); // Set initialLoad to false after the first render
      setLoading(false); // Set loading to false to show components initially
      return; // Exit early to avoid fetching data on the first render
    }
    if (apiEndPoint) {
      setLoading(true); // Start loading before fetching data
      fetchAllData();
    }
  }, [apiEndPoint, initialLoad]); // Only re-run effect if apiEndPoint or initialLoad changes

  return [alldata, loading];
}

export default useFetchData;
