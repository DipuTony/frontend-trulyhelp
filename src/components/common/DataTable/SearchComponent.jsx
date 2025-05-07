import React from 'react'

function SearchComponent({ searchText, filter, setFilter }) {
    return (
        <>
            <div className='my-2 flex'>
                <p className='mx-2 font-semibold'> Search {searchText} : </p>
                <input className='border text-base border-gray-500 px-2 py-3 outline-sky-400 hover:ring-1 bg-gray-50 rounded-sm md:h-7 h-7 w-1/2 sm:w-fit' type="text" value={filter || ''} onChange={e => setFilter(e.target.value)} />
            </div>
        </>
    )
}

export default SearchComponent
