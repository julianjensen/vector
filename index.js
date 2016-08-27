/** ****************************************************************************************************
 *
 * A much faster and versatile array class.
 *
 * File: index.js
 * @author Julian Jensen <julian@exploreplanet3.com> on 27-AUG-2016
 * @version 0.0.1
 * @copyright Planet3, Inc.
 *******************************************************************************************************/
'use strict';
//@formatter:off

const
    bind = function ( func, thisContext ) {
        return function ( a ) {
            return func.call( thisContext, a );
        };
    },
    bind3 = function ( func, thisContext ) {
        return function ( a, b, c ) {
            return func.call( thisContext, a, b, c );
        };
    },
    bind4 = function( func, thisContext ) {
        return function( a, b, c, d ) {
            return func.call( thisContext, a, b, c, d );
        };
    },
    LARGE_ARRAY_SIZE = 200;

class Vector extends Array
{
    constructor( ...args )
    {
        if ( args.length === 1 && Array.isArray( args[ 0 ] ) )
            super( args[ 0 ] );
        else if ( args.length )
            super( ...args );
        else
            super();
    }

    each( fn, thisContext )
    {
        const iterator = thisContext !== undefined ? bind3(fn, thisContext) : fn;

        let index = -1,
            length = this.length;

        while ( ++index < length )
            iterator( this[ index ], index, this );

        return this;
    }

    static each( fn, thisContext )
    {
        const
            that = this,
            iterator = thisContext !== undefined ? bind3( fn, thisContext ) : fn;

        return function( arr ) {
            const
                length = arr ? arr.length : 0;

            let index = -1;

            while ( ++index < length )
                iterator( arr[ index ], index, arr );

            return arr;
        };
    }

    map( fn, thisContext )
    {
        const
            length = this.length,
            result = new Vector( length ),
            iterator = thisContext !== undefined ? bind3(fn, thisContext) : fn;

        let i = -1;

        while ( ++i < length )
            result[ i ] = iterator( this[ i ], i, this );

        return result;
    }

    reduce( fn, initialValue, thisContext )
    {
        const
            length = this.length,
            iterator = thisContext !== undefined ? bind4(fn, thisContext) : fn;

        let i = 0, result;

        if ( initialValue === undefined )
        {
            i = 1;
            result = this[ 0 ];
        }
        else
            result = initialValue;

        for ( ; i < length; i++ )
            result = iterator( result, this[ i ], i, this );

        return result;
    }

    reduceRight( fn, initialValue, thisContext )
    {
        const
            length = this.length,
            iterator = thisContext !== undefined ? bind4( fn, thisContext ) : fn;

        let i = length - 1, result;

        if ( initialValue === undefined )
            result = this[ i-- ];
        else
            result = initialValue;

        for ( ; i >= 0; i-- )
            result = iterator( result, this[ i ], i, this );

        return result;
    }

    concat( ...args )
    {
        const
            length = args.length,
            arr = Vector.from( this );

        let i = -1, index = this.length;

        while ( ++i < length )
        {
            let item = args[ i ];

            if ( Array.isArray( item ) )
            {
                let childLength = item.length,
                    j = -1;

                while ( ++j < childLength )
                    arr[ index + j ] = item[ j ];

                index += childLength;
            }
            else
                arr[ index++ ] = item;
        }

        return arr;
    }

    push( ...args )
    {
        const
            length = args.length;

        let index = this.length,
            i = -1;

        while ( ++i < length )
            this[ index + i ] = args[ i ];

        return this;
    }

    clone()
    {
        const
            length = this.length,
            sliced = new Vector( length );

        let i = -1;

        while ( ++i < length )
            sliced[ i ] = this[ i ];

        return sliced;
    }

    static clone( input )
    {
        const
            length = input.length,
            sliced = new Vector( length );

        let i = -1;

        while ( ++i < length )
            sliced[ i ] = input[ i ];

        return sliced;
    }

    all( fn, thisContext )
    {
        return this.every( fn, thisContext );
    }

    every( fn, thisContext )
    {
        const
            length = this.length,
            iterator = thisContext !== undefined ? bind3( fn, thisContext ) : fn;

        let i = -1;

        while ( ++i < length )
            if ( !iterator( this[ i ], i, this ) ) return false;

        return true;
    }

    any( fn, thisContext )
    {
        return this.some( fn, thisContext );
    }

    some( fn, thisContext )
    {
        const
            length = this.length,
            iterator = thisContext !== undefined ? bind3( fn, thisContext ) : fn;

        let i = -1;

        while ( ++i < length )
            if ( iterator( this[ i ], i, this ) ) return true;

        return false;
    }

    slice( slice, sliceEnd )
    {
        const ret = new Vector();

        let len = this.length;

        if ( len === 0 ) return ret;

        const start = slice < 0 ? Math.max( 0, slice + len ) : slice || 0;

        if ( sliceEnd !== undefined )
            len = sliceEnd < 0 ? sliceEnd + len : sliceEnd;

        while ( len-- > start )
            ret[ len - start ] = this[ len ];

        return ret;
    }

    fill( value, start, end, _dir )
    {
        const
            length = this.length,
            dir = _dir === undefined ? 0 : +_dir;

        if ( start === undefined ) start = 0;
        if ( end === undefined ) end = length;

        let i = start - 1;

        if ( dir !== 0 )
            while ( ++i < end ) {
                this[ i ] = value;
                value += dir;
            }
        else
            while ( ++i < end )
                this[ i ] = value;

        return this;
    }

    includes( value )
    {
        if ( Array.isArray( value ) )
        {
            const _includes = bind( this.includes, this );

            return this.some( _includes )
        }

        return this.indexOf( value ) !== -1;
    }

    indexOf( target, fromIndex )
    {
        const
            length = this.length;

        let i = 0;

        if ( typeof fromIndex === 'number' )
        {
            i = fromIndex;
            if ( i < 0 )
            {
                i += length;
                if ( i < 0 ) i = 0;
            }
        }

        for ( ; i < length; i++ )
            if (this[ i ] === target ) return i;

        return -1;
    }

    lastIndexOf( target, fromIndex )
    {
        const
            length = this.length;

        let i = length - 1;

        if ( typeof fromIndex === 'number' )
        {
            i = fromIndex;
            if ( i < 0 ) i += length;
        }

        for ( ; i >= 0; i-- )
            if ( this[ i ] === target ) return i;

        return -1;
    }

    pluck( field )
    {
        const
            length = this.length,
            plucked = new Vector();

        let count = 0, value, i = -1;

        while ( ++i < length )
        {
            value = this[ i ];

            if ( typeof value === 'object' && value[ field ] !== undefined )
            {
                plucked[ count++ ] = value[ field ];
            }
        }

        return plucked;
    }

    _setToArray( set )
    {
        let index = -1,
            result = new Vector( set.size );

        set.forEach( value => result[ ++index ] = value );

        return result;
    }

    uniq()
    {
        let index = -1;

        const
            length = this.length,
            result = new Vector();

        if ( length >= LARGE_ARRAY_SIZE )
            return this._setToArray( new Set( this ) );

        outer:
            while ( ++index < length )
            {
                const
                    value = this[ index ];

                let seenIndex = result.length;

                while ( seenIndex-- )
                    if ( result[ seenIndex ] === value ) continue outer;

                result[ result.length ] = value;
            }

        return result;
    }

    flatten()
    {
        const
            length = this.length;

        if ( !length ) return new Vector();

        return Vector._flatten( this );
    }

    static _flatten( arr, result = new Vector() )
    {
        const
            length = arr.length;

        if ( !length ) return result;

        let index = -1;

        while ( ++index < length )
        {
            let value = arr[ index ];

            if ( value instanceof Vector || Array.isArray( value ) )
                Vector._flatten( value, result );
            else
                result[ result.length ] = value;
        }

        return result;
    }

    last()
    {
        const length = this.length - 1;

        return length === -1 ? undefined : this[ length ];
    }

    union( ...arrs )
    {
        return this.concat( ...arrs ).uniq();
    }

    intersection( ...arrs )
    {
        arrs[ arrs.length ] = this;

        let shortest = 0;

        Vector.each( ( a, i ) => a.length < arrs[ shortest ].length && ( shortest = i ) )( arrs );

        let index = -1,
            resultIndex = 0,
            main = arrs[ shortest ];

        const
            result = new Vector(),
            length = main.length;

        skip:
            while ( ++index < length )
            {
                let j = -1,
                    childLength = arrs.length,
                    value = main[ index ];

                while ( ++j < childLength )
                {
                    if ( j !== shortest )
                    {
                        if ( !arrs[ j ].includes( value ) ) continue skip;
                    }
                }

                result[ resultIndex++ ] = value;
            }

        return result;
    }

    equals( arr )
    {
        const
            length = this.length;

        if ( length !== arr.length ) return false;

        const
            self = this.sort(),
            other = arr.sort();

        let i = -1;

        while ( ++i < length )
            if ( self[ i ] !== other[ i ] ) return false;

        return true;
    }

    [ Symbol.toPrimitive ]( hint )
    {
        if ( hint === 'number' ) return this.length;
        else if ( hint === 'string' ) return '[ ' + this.join( ', ' ) + ' ]';

        return !!this.length;
    }

    compact( inPlace = false )
    {
        const
            result = inPlace ? this : new Vector(),
            length = this.length;

        let resultIndex = 0,
            index = -1;

        while ( ++index < length )
            if ( !!this[ index ] ) result[ resultIndex++ ] = this[ index ];

        result.length = resultIndex;

        return result;
    }

    static from( arg )
    {
        return Vector.clone( Array.from( arg ) );
    }

    static array( arg )
    {
        return Array.isArray( arg );
    }

    static random( count, min = 0, max = 1, float = false )
    {
        const
            a = new Vector( count ),
            length = count,
            _min = min < max ? min : max,
            _max = max > min ? max : min,
            range = _max - _min + 1;

        let i = -1, val;

        while ( ++i < length )
        {
            val = Math.random() * range;
            if ( !float ) val |= 0;
            a[ i ] = val + _min;
        }

        return a;
    }
}

module.exports = Vector;
