'use client'

import { createClient } from '@/utils/supabase/client';
import type { AthleteTableTypes } from '@/types/athleteTable';
import { useState, useEffect } from 'react'

export default function AthleteTable() {
    const [itemsPerPage, setItemsPerPage] = useState<number>(100)
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [liftingResults, setLiftingResults] = useState<AthleteTableTypes[]>([]);
    const [athleteSearch, setAthleteSearch] = useState('')

    useEffect(() => {fetchData()}, [itemsPerPage, athleteSearch])

    function selectRows(event: React.ChangeEvent<HTMLSelectElement>) {
        setItemsPerPage(parseInt(event.target.value))
    }

    function searchAthlete(event: React.ChangeEvent<HTMLSelectElement>) {
        setAthleteSearch(event.target.value)
    }

    async function fetchData() {
        setLoading(true)
        try {
            const supabase = createClient();
            let query = supabase
                .from("lifting_results")
                .select();
            if (athleteSearch) {
                query = query.eq("name", athleteSearch);
            }
            const { data, error } = await query.limit(itemsPerPage);
            if (error) {
                setError('Error loading Supabase data')
                console.log('Error loading Supabase data')
                return <div>Data Failed to load</div>
            } else {
                setLiftingResults(data || [])
            }
        } catch (err) {
            setError('Data failed to load')
        } finally {
            setLoading(false)
        }
    }
    
    if (error) {
        return <div>{error}</div>;
    }
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    function makeRate(column: keyof AthleteTableTypes) {
        const successfulLifts = liftingResults.filter((result: AthleteTableTypes) => {
            const value = result[column];
            return typeof value === 'number' && value > 0;
        }).length;
        
        const totalLifts = liftingResults.length;
        const percentage = totalLifts > 0 ? (successfulLifts / totalLifts) * 100 : 0;
        
        return percentage;
    }

    return (
        <main className="flex flex-col mx-auto items-center mb-10">
            <div className='flex items-center justify-center gap-8'>
                <input 
                    type='search' 
                    placeholder="Athlete Name" 
                    className="border p-1" 
                    onSubmit={searchAthlete}
                />
                <button >Search Athlete</button>
                <form>
                    <label>Rows Per Page: </label>
                    <select 
                        name="rows" 
                        onChange={selectRows} 
                        value={itemsPerPage}
                        className='border p-1'
                    >
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="500">500</option>
                        <option value="1000">1000</option>
                    </select>
                </form>
            </div>
            <table className="mt-5 border w-[95%]">
                <thead className="border bg-blue-300">
                    <tr>
                        <th className="w-50 border border-gray-400 p-2 text-left">Name</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">Date</th>
                        <th className="w-70 border border-gray-400 p-2 text-left">Meet</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">Bodyweight</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">Snatch 1</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">Snatch 2</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">Snatch 3</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">C&J 1</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">C&J 2</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">C&J 3</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">Total</th>
                    </tr>
                </thead>
                <tbody>
                {liftingResults.length === 0 ? 
                    <tr>
                        <td className='text-center'>No Lifting Results Found</td>
                    </tr>
                    : liftingResults.map((results: AthleteTableTypes) => (
                        <tr key={results.id}>
                            <td className="w-50 border border-gray-400 p-2 text-left">{results.name}</td>
                            <td className="w-40 border border-gray-400 p-2 text-left">{results.date}</td>
                            <td className="w-70 border border-gray-400 p-2 text-left">{results.meet}</td>
                            <td className="w-40 border border-gray-400 p-2 text-left">{results.body_weight}</td>
                            <td className="w-40 border border-gray-400 p-2 text-left">{results.snatch1}</td>
                            <td className="w-40 border border-gray-400 p-2 text-left">{results.snatch2}</td>
                            <td className="w-40 border border-gray-400 p-2 text-left">{results.snatch3}</td>
                            <td className="w-40 border border-gray-400 p-2 text-left">{results.cj1}</td>
                            <td className="w-40 border border-gray-400 p-2 text-left">{results.cj2}</td>
                            <td className="w-40 border border-gray-400 p-2 text-left">{results.cj3}</td>
                            <td className="w-40 border border-gray-400 p-2 text-left">{results.total}</td>
                        </tr>))}
                </tbody>
                <tfoot className="border bg-blue-300">
                    <tr>
                        <th className="w-50 border-l border-b border-l-gray-400 border-b-gray-400 p-2 "></th>
                        <th className="w-40 border-b border-b-gray-400 p-2"></th>
                        <th className="w-40 border-b border-b-gray-400 p-2"></th>
                        <th className="w-70 border-b border-b-gray-400 p-2 text-left">Successful Lift %</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">{makeRate('snatch1')}%</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">{makeRate('snatch2')}%</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">{makeRate('snatch3')}%</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">{makeRate('cj1')}%</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">{makeRate('cj2')}%</th>
                        <th className="w-40 border border-gray-400 p-2 text-left">{makeRate('cj3')}%</th>
                        <th className="w-40 border border-gray-400 p-2 text-left"></th>
                    </tr>
                </tfoot>
            </table>
        </main>
    )
}