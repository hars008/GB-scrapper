import React from 'react'


const ResultCard = ({results} :any) => {
    
    console.log("result: ", results);
  return (
    <div className="sm:p-2 mt-4 xl:p-10">
      {results?.length > 0 ? (
        <div className="w-full flex flex-col">
          <h1 className="text-[30px] max-sm:text-center">Results</h1>
          <div className="gap-2 flex flex-col  w-full">
            {results.map((result: any, index: number) => (
              <div
                key={index}
                className="border-2 hover:scale-105 transition duration-200 rounded-xl p-2"
              >
                <div className="flex item-center gap-4 pb-2 border-b  ">
                  <div className="sm:w-11 sm:h-11 w-8 h-8 rounded-lg item-center justify-between">
                    <img
                      src={result.img}
                      alt={result.title}
                      width={100}
                      height={100}
                      className="sm:w-11 sm:h-11 w-8 h-8 "
                    />
                  </div>
                  <div className="flex flex-col w-full overflow-hidden">
                    <a
                      href={result.link}
                      className="sm:text-xl text-base text-blue-900 w-full font-bold "
                    >
                      {result.title}
                    </a>
                    <a
                      href={result.link}
                      className="text-blue-600 text-sm w-full"
                    >
                      {result.link}
                    </a>
                  </div>
                </div>
                <p className="text-gray-600 ">{result.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ResultCard
