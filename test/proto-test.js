/** ******************************************************************************************************************
 * @file Unit tests for prototype overrides.
 * @author Julian Jensen <jjdanois@gmail.com>
 * @since 1.0.0
 * @date 23-Jul-2017
 *********************************************************************************************************************/
"use strict";

require( '../proto' );

const
    expect = require( 'chai' ).expect;

let vec = Array.random( 100, 0, 10 ),
    count;

do {
    count = 0;
    vec.each( val => !val && count++ );
    if ( !count ) vec = vec = Array.random( 100, 0, 10 );
} while ( !count );

describe( 'proto overrides', function() {

    it( 'should create an array with a range of values', () => {
        expect( Array.range( 0, 5 ) ).to.eql( [ 0, 1, 2, 3, 4, 5 ] );
        expect( Array.range( 0, 6, 2 ) ).to.eql( [ 0, 2, 4, 6 ] );
        expect( Array.range( 5, 0 ) ).to.eql( [ 5, 4, 3, 2, 1, 0 ] );

        expect( Array.range( 0, 5, 0 ) ).to.eql( [] );
        expect( Array.range( 0, 5, -1 ) ).to.eql( [ 0, 1, 2, 3, 4, 5 ] );
        expect( Array.range( 5, 0, 1 ) ).to.eql( [ 5, 4, 3, 2, 1, 0 ] );

        expect( Array.range( 1 ) ).to.eql( [] );
    } );

    it( 'should have the aliases', () => {
        const test = [ 1, 2, 3, 4, 5 ];

        let result = 0;

        test.each( val => result += val );

        expect( result ).to.equal( 15 );
        expect( test.all( ( val, i ) => test[ i ] === val ) ).to.be.true;
        expect( test.any( ( val, i ) => test[ i ] === val ) ).to.be.true;
        expect( test.all( ( val, i ) => test[ i ] === val + 1 ) ).to.be.false;
        expect( test.any( ( val, i ) => test[ i ] === val + 1 ) ).to.be.false;

        expect( Array.clone( test ) ).to.eql( [ 1, 2, 3, 4, 5 ] );
        expect( test.clone() ).to.eql( [ 1, 2, 3, 4, 5 ] );
    } );

    it( 'should have a better push and pop', () => {
        const test = [ 1, 2, 3 ];

        expect( test.append( 4 ) ).to.eql( [ 1, 2, 3, 4 ] );
        expect( test.append( 5, 6 ) ).to.eql( [ 1, 2, 3, 4, 5, 6 ] );
        expect( test.prepend( 0 ) ).to.eql( [ 0, 1, 2, 3, 4, 5, 6 ] );
        expect( test.prepend( -2, -1 ) ).to.eql( [ -2, -1, 0, 1, 2, 3, 4, 5, 6 ] );

        expect( test.last ).to.equal( 6 );
        expect( test.lastIndex ).to.equal( 8 );
    } );

    it( 'should create an array of random numbers', () => {

        const
            intVals = Array.random( 10, 0, 10 ),
            floatVals = Array.random( 10, 0, 1, true );

        expect( intVals ).to.have.length( 10 );
        expect( floatVals ).to.have.length( 10 );

        expect( intVals.all( val => val | 0 === val ) ).to.be.true;
        expect( floatVals.any( val => val | 0 !== val ) ).to.be.true;
    } );

    it( "should pluck 'em good, pluck 'em real good", () => {
        const test = [
                { first: 'one', second: 'two', last: 'three' },
                { first: 'one', second: 'two', last: 'three' },
                { first: 'one', second: 'two', last: 'three' },
                { first: 'one', last: 'three' }
            ];

        expect( test.pluck( 'first' ) ).to.eql( [ 'one', 'one', 'one', 'one' ] );
        expect( test.pluck( 'first', 'last' ) ).to.eql( [ [ 'one', 'three' ], [ 'one', 'three' ], [ 'one', 'three' ], [ 'one', 'three' ] ] );
        expect( test.pluck( 'first', 'second' ) ).to.eql( [ [ 'one', 'two' ], [ 'one', 'two' ], [ 'one', 'two' ], [ 'one', undefined ] ] );
        // expect( test.pluck( 'first' ) ).to.eql( [ { first: 'one' }, { first: 'one' }, { first: 'one' }, { first: 'one' } ] );
        // expect( test.pluck( 'first', 'last' ) ).to.eql( [ { first: 'one', last: 'three' }, { first: 'one', last: 'three' }, { first: 'one', last: 'three' }, { first: 'one', last: 'three' } ] );
        // expect( test.pluck( 'first', 'second' ) ).to.eql( [ { first: 'one', second: 'two' }, { first: 'one', second: 'two' }, { first: 'one', second: 'two' }, { first: 'one', second: undefined } ] );
    } );

    it( 'should force unique and flat values', () => {
        const test = [ 1, 2, 3, 4, 3, 5, 5 ],
            nested = [ 1, 2, [ 3, [ 4, 5 ], 6 ], 7 ],
            big = [];

        for ( let n = 0; n < 400; n++ )
            big[ n ] = n;

        big[ 399 ] = 1;

        expect( big ).to.have.length( 400 );
        expect( big.uniq() ).to.have.length( 399 );

        expect( test.uniq() ).to.eql( [ 1, 2, 3, 4, 5 ] );
        expect( nested.flatten() ).to.eql( [ 1, 2, 3, 4, 5, 6, 7 ] );
        expect( nested.flatten( false ) ).to.eql( [ 1, 2, 3, [ 4, 5 ], 6, 7 ] );
    } );

    it( 'should do some set stuff', () => {
        const
            test = [ 1, 2, 3, 4, 5, 6, 7, 8 ],
            test1 =      [ 3, 4, 5, 6, 7, 8, 9 ],
            test2 =   [ 2, 3, 10, 11 ],
            out = [ 20, 21 ],
            out1 = [ 22, 23 ];

        expect( test.union( test1 ) ).to.eql( [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] );
        expect( test.union( test1, test2 ) ).to.eql( [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] );

        expect( test.intersection( test1 ) ).to.eql( [ 3, 4, 5, 6, 7, 8 ] );
        expect( test.intersection( test1, test2 ) ).to.eql( [ 3 ] );

        expect( test.intersection( out ) ).to.eql( [] );
        expect( test.intersection( out, out1 ) ).to.eql( [] );
    } );

    it( 'should compare arrays', () => {

        expect( [ 2, 1, 3 ].equals( [ 1, 2, 3 ] ) ).to.be.true;
        expect( [ 3, 1, 3 ].equals( [ 1, 2, 3 ] ) ).to.be.false;

    } );

    it( 'should compactify an array', () => {

        expect( [ 1, 0, 2 ].compact() ).to.eql( [ 1, 2 ] );
        expect( [ 1, , 2 ].compact() ).to.eql( [ 1, 2 ] );

        expect( [ 1, 0, 2 ].compact( false ) ).to.eql( [ 1, 0, 2 ] );
        expect( [ 1, , 2 ].compact( false ) ).to.eql( [ 1, 2 ] );

        let inplace = [ 1, 0, 2 ];

        inplace.compact( true, true );

        expect( inplace ).to.eql( [ 1, 2 ] );
    } );

    it( 'should chop some arrays', () => {

        expect( [ 1, 2, 3, 4, 5, 6 ].drop( 2 ) ).to.eql( [ 3, 4, 5, 6 ] );
        expect( [ 1, 2, 3, 4, 5, 6 ].drop( -2 ) ).to.eql( [ 1, 2, 3, 4 ] );
        expect( [ 1, 2, 3, 4, 5, 6 ].drop( 0 ) ).to.eql( [ 1, 2, 3, 4, 5, 6 ] );

        expect( [ 1, 2, 3, 4, 5, 6 ].head( 3 ) ).to.eql( [ 1, 2, 3 ] );
        expect( [ 1, 2, 3, 4, 5, 6 ].tail( 2 ) ).to.eql( [ 5, 6 ] );
        expect( [ 1, 2, 3, 4 ].head( -2 ) ).to.eql( [] );
        expect( [ 1, 2, 3, 4 ].tail( -2 ) ).to.eql( [] );
        expect( [ 1, 2, 3, 4 ].head( 100 ) ).to.eql( [ 1, 2, 3, 4 ] );
        expect( [ 1, 2, 3, 4 ].tail( 100 ) ).to.eql( [ 1, 2, 3, 4 ] );

    } );

    it( 'should remove elements', () => {
        expect( [ 1, 2, 3, 4 ].without( 3 ) ).to.eql( [ 1, 2, 4 ] );
        expect( [ 1, 2, 3, 4 ].without( 10 ) ).to.eql( [ 1, 2, 3, 4 ] );
        expect( [ 1, 2, 3, 4 ].without( v => v === 2 ) ).to.eql( [ 1, 3, 4 ] );
    } );

    it( 'should have a functional programming mapper', () => {
        const add10 = Array.mapper( v => v + 10 );

        expect( add10( [ 1, 2, 3 ] ) ).to.eql( [ 11, 12, 13 ] );
        expect( add10( [ 1, 2, 3 ], [ 4, 5, 6 ] ) ).to.eql( [ 11, 12, 13, 14, 15, 16 ] );
        expect( add10() ).to.eql( [] );
        expect( add10( [] ) ).to.eql( [] );
    } );

    it( 'should have a functional programming reducer', () => {
        const sum = Array.reducer( ( acc, v ) => acc + v, 0 );

        expect( sum( [ 1, 2, 3 ] ) ).to.equal( 6 );
        expect( sum( [ 1, 2, 3 ], [ 4, 5, 6 ] ) ).to.equal( 21 );
        expect( sum() ).to.be.undefined;
        expect( sum( [] ) ).to.be.undefined;
    } );

    it( 'should have a functional programming filter', () => {
        const odd = Array.strainer( v => v & 1 );

        expect( odd( [ 1, 2, 3 ] ) ).to.eql( [ 1, 3 ] );
        expect( odd( [ 1, 2, 3 ], [ 4, 5, 6 ] ) ).to.eql( [ 1, 3, 5 ] );
        expect( odd() ).to.eql( [] );
        expect( odd( [] ) ).to.eql( [] );
    } );

    it( 'should have a functional programming looper', () => {
        let result = [];
        const see = Array.looper( v => result.push( v ) );

        see( [ 1, 2, 3 ] );
        expect( result ).to.eql( [ 1, 2, 3 ] );
        result = [];
        see( [ 1, 2, 3 ], [ 4, 5, 6 ] );
        expect(  result ).to.eql( [ 1, 2, 3, 4, 5, 6 ] );
        result = [];
        see()
        expect( result ).to.eql( [] );
        see( [] )
        expect( result ).to.eql( [] );
    } );

    it( 'should resolve permuations', () => {
        const
            nested = [ [ 1, 10 ], [ 2, [ 3, 4, 9 ], 5 ], 6 ],
            untangled = [ [ 1, 2, 3, 5, 6 ],
                          [ 1, 2, 4, 5, 6 ],
                          [ 1, 2, 9, 5, 6 ],
                          [ 10, 2, 3, 5, 6 ],
                          [ 10, 2, 4, 5, 6 ],
                          [ 10, 2, 9, 5, 6 ] ];

        expect( nested.permutations() ).to.eql( untangled );
    } );

} );
