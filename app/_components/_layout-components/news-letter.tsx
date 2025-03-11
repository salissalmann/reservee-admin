import React from "react";

const NewsLetter = () => {
  return (
    <div className="bg-primary p-8 text-white flex flex-col md:flex-row items-center justify-between rounded-lg -mb-[6rem] relative z-20  space-y-5">
      <div className=" flex-grow">
        <h1 className="text-2xl">Newsletter</h1>
        <p className="text-lg font-light">
          Be the first one to know about discounts, offers and events
        </p>
      </div>

      <div className="bg-white  dark:bg-tertiary rounded-full w-full md:w-96 flex p-1">
        <input
          type="search"
          id="default-search"
          className="block w-full p-3  text-sm text-gray-900  dark:bg-tertiary   rounded-full"
          placeholder="Enter your email"
          required
        />
        <button className="flex items-center justify-center  bg-primary rounded-full text-white p-2 w-fit px-10">
          Send
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
