'use client'
import React from 'react'
import Image from 'next/image'
import Spacenav from '../../components/spacenav';
import { getSpaceList } from '@/app/Apis/publicapi';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

interface Space {
  id: number;
  name: string;
  image?: any
  client_name?: string;
  updated_at?: string;
  created_at?: string;
  category?: string;
  is_active?: number;
}

const Newspace = () => {
  const [spaceData, setSpaceData] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredSpaceData, setFilteredSpaceData] = useState<Space[]>([]);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (activeFilter === 'active') {
      setFilteredSpaceData(spaceData.filter(space => space.is_active === 1));
    } else {
      setFilteredSpaceData(spaceData);
    }
  }, [activeFilter, spaceData]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleImageError = (spaceId: number) => {
    setImageErrors(prev => ({ ...prev, [spaceId]: true }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res = await getSpaceList();
        setSpaceData(res?.data || []);
        console.log("yo", res?.data)
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ overflowX: "hidden" }} className='min-h-screen flex flex-col select-none ' >
      <Navbar heading="Your space" />

      <section className='flex  flex-wrap justify-center'>
        <div className='w-[95%] min-h-[100vh]  flex flex-col gap-[40px] mt-[30px]'>

          <div className='w-full flex flex-col justify-center -mt-[10px]'>
            <div className='flex justify-between items-center w-[100%] h-auto'>
              <h1 className='text-[#121217] font-[600] text-[24px] font-sans'>
                Assistants you have created
              </h1>
              <ul className='flex gap-[10px] mr-[110px] gap-[20px] items-center'>
                <div className='flex items-center gap-[10px] ' >
                  <li
                    onClick={() => handleFilterChange('all')}
                    className={`flex items-center justify-center gap-[10px] px-[16px] py-[8px] rounded-full font-sans font-[600] text-[14px] cursor-pointer transition-colors ${activeFilter === 'all'
                      ? 'bg-[#F4F4F5] border border-[#E4E4E7] text-[#18181B]'
                      : 'bg-white border border-transparent text-[#71717A] hover:bg-[#F4F4F5]'
                      }`}
                  >
                    <span>All ({spaceData.length})</span>
                    {activeFilter === 'all' && (
                      <Icon icon="charm:tick" width="16" height="16" style={{ color: "black" }} />
                    )}
                  </li>
                  <li
                    onClick={() => handleFilterChange('active')}
                    className={`flex items-center justify-center gap-[10px] px-[16px] py-[8px] rounded-full font-sans font-[600] text-[14px] cursor-pointer transition-colors ${activeFilter === 'active'
                      ? 'bg-[#F4F4F5] border border-[#E4E4E7] text-[#18181B]'
                      : 'bg-white border border-transparent text-[#71717A] hover:bg-[#F4F4F5]'
                      }`}
                  >
                    <span>Active ({spaceData.filter(space => space.is_active === 1).length})</span>
                    {activeFilter === 'active' && (
                      <Icon icon="charm:tick" width="16" height="16" style={{ color: "black" }} />
                    )}
                  </li>
                </div>

                <div className='flex'>
                  <Link
                    href="/spacebusiness"
                  >
                    <button className='flex -mr-[105px] rounded-[8px] bg-[#685BC7] text-[14px] text-white font-[500] items-center pt-[8px] pb-[8px] pr-[16px] pl-[16px] hover:cursor-pointer '>
                      Create New Space
                    </button>
                  </Link>
                </div>

              </ul>
            </div>
          </div>

          <div className='w-[100%]  flex items-center justify-center  flex-col gap-[30px]'>
            <ul className='flex flex-wrap  justify-between items-center gap-[30px]'>
              {loading ? (
                <div className="flex justify-center  items-center w-full h-64">
                  <div className="flex items-center  gap-2">
                    <div className="w-6 h-6 border-2  border-[#685BC7] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500">Loading...</span>
                  </div>
                </div>
              ) : filteredSpaceData.length === 0 && spaceData.length > 0 && activeFilter === 'active' ? (
                <div className="flex flex-col justify-center  items-center w-full h-64">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2m16-7H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active spaces found</h3>
                  <p className="text-gray-500 text-center">There are no active spaces to display at the moment.</p>
                </div>
              ) : filteredSpaceData.length === 0 ? (
                <div className="flex flex-col  justify-center items-center w-full h-64">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2m16-7H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No spaces found</h3>
                  <p className="text-gray-500 text-center">Get started by creating your first space.</p>
                </div>
              ) : (
                filteredSpaceData.map((space) => (
                  <Link
                    key={space.id}
                    href={`/dashboard/space?name=${encodeURIComponent(space.name)}&id=${space.id}&image=${encodeURIComponent(space.image || '')}`}
                  >
                    <li className='w-[352px]  items-center flex justify-center list-none h-auto rounded-[16px] border-[1px] border-[#EAECF0] hover:shadow-lg transition-shadow duration-200'>
                      <div >
                        <div className='flex w-[352px] flex-col relative justify-end p-[20px] w-[289px] rounded-t-[16px] h-[127px] bg-[#9E77ED]'>
                          <ul className='flex -space-x-4 rtl:space-x-reverse'>
                            <li className='relative w-[59px] h-[59px]'>
                              {imageErrors[space.id] || !space.image ? (
                                <div className='w-[59px] h-[59px] absolute top-[75%] rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xl font-bold'>
                                  {space.name.charAt(0).toUpperCase()}
                                </div>
                              ) : (
                                <div className='w-[59px] h-[59px] absolute top-[75%] rounded-full border-2 border-white overflow-hidden bg-white'>
                                  <Image
                                    src={space.image}
                                    alt={`${space.name} avatar`}
                                    width={59}
                                    height={59}
                                    className='w-full h-full object-cover'
                                    onError={() => handleImageError(space.id)}
                                    loading="lazy"
                                    quality={85}
                                    placeholder="blur"
                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkiIGhlaWdodD0iNTkiIHZpZXdCb3g9IjAgMCA1OSA1OSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjU5IiBoZWlnaHQ9IjU5IiBmaWxsPSIjOUU3N0VEIi8+Cjwvc3ZnPgo="
                                  />
                                </div>
                              )}
                            </li>
                          </ul>
                        </div>

                        <section>
                          <div className='w-[352px] h-auto p-[16px] flex flex-col gap-[16px]'>
                            <div>
                              <ul className='flex justify-between mt-[20px] items-center'>
                                <li className='list-none text-[#1D2939] font-semibold font-normal text-[14px] flex-1 truncate'>
                                  {space.name}
                                </li>

                                <li className='flex justify-center items-center list-none w-[50px] h-auto rounded-[12px] border-[1px] border-[#ABEFC6] bg-[#ECFDF3] text-[#067647] font-400 text-[12px] pt-[1px] pr-[4px] pb-[1px] pl-[4px] ml-2'>
                                  <Icon icon="icon-park-outline:dot" width="12" style={{ color: "#17B26A" }} />
                                  Live
                                </li>
                              </ul>

                              <ul>
                                <li className='flex text-[#475467] -mt font-500 text-[12px] font-Inter'>
                                  {space.category}
                                </li>
                              </ul>
                            </div>

                            <div className='flex gap-[80px] justify-between'>
                              <ul>
                                <li className='text-[12px] font-normal text-[#667085] font-Inter'>
                                  <p>Created on</p>
                                  <p className='text-[#101828]'>{space.created_at}</p>
                                </li>
                              </ul>
                              <ul className='flex flex-col gap-[8px]'>
                                <li className='text-[12px] font-normal text-[#667085] font-Inter'>
                                  <p>Last update</p>
                                  <p className='text-[#101828]'>{space.updated_at}</p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </section>
                      </div>
                    </li>
                  </Link>
                ))
              )}

              {!loading && (
                <Link href="/spacebusiness">
                  <div className="bg-[#F4F4F5] border-[1px] border-[#EAECF0] flex justify-center items-center rounded-[16px] w-[352px] h-[270px] hover:cursor-pointer hover:bg-[#E4E4E7] transition-colors duration-200">
                    <div className="flex-col h-auto">
                      <Icon
                        className="ml-6"
                        icon="bitcoin-icons:plus-filled"
                        width="24"
                        height="24"
                        style={{ color: "#020617" }}
                      />
                      <p className="text-[#1D2939] mt-[10px] text-center font-Inter font-semibold text-[14px]">
                        New Space
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Newspace