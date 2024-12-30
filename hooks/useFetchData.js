const { default: axios } = require("axios");
const { useEffect, useState } = require("react");

function useFetchData() {
  const [alldata, setAlldata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) {
      // set initialload to false to prevent the api call on subsequent render

      setInitialLoad(false);
      setLoading(false); // set loading to false to show components initally
      return; // exit useeffect
    }
    setLoading(true);
    const fetchAllData = async () => {
      try {
        const res = await axios.get(apiEndPoint);
        const alldata = res.data;
        setAlldata(alldata);
        setLoading(false); //set loading state to false after data is fatched
      } catch (error) {
        console.error("error fetching blog data", error);
        setLoading(false); // set loading false even if ther's an error
      }
    };
    // fetch blog data only if apiendpoint is exists
    if (apiEndPoint) {
      fetchAllData();
    }
  }, [initialLoad, apiEndPoint]); // depends on initialload and apiendpoint to trigger api call.
  return [alldata, loading];
}
export default useFetchData;
